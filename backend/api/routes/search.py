import time
from fastapi import APIRouter, HTTPException

from schemas.search import SearchRequest, SearchResponse
from services.overpass import discover_businesses, parse_query
from services.analyzer import analyze_website
from services.scorer import compute_score
from models.lead import Lead
from models.search_history import SearchHistory
from schemas.lead import LeadResponse

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    start = time.monotonic()

    niche = request.niche
    city = request.city
    if not niche or not city:
        niche, city = parse_query(request.query)

    niche = (niche or "restaurant").strip()
    city = (city or "Unknown").strip()

    print(f"📥 Search request — niche='{niche}', city='{city}', limit={request.limit}")

    # Fetch a much larger pool from OSM so we can filter down to ones with websites
    FETCH_MULTIPLIER = 10
    raw_businesses = await discover_businesses(niche, city, request.limit * FETCH_MULTIPLIER)

    if not raw_businesses:
        raise HTTPException(
            status_code=404,
            detail=(
                f"No businesses found for '{niche}' in '{city}'. "
                f"Check the city name spelling or try a broader niche (e.g. 'restaurant')."
            ),
        )

    # Split into businesses with and without websites
    with_website = [b for b in raw_businesses if b.get("website")]
    without_website = [b for b in raw_businesses if not b.get("website")]

    print(f"  📊 OSM returned {len(raw_businesses)} total — {len(with_website)} have websites, {len(without_website)} don't")

    # Prioritize businesses WITH websites; pad with no-website ones only if needed
    ordered = with_website + without_website
    candidates = ordered[:request.limit * 3]  # grab extra to account for DB duplicates

    saved_leads: list[LeadResponse] = []

    for biz in candidates:
        if len(saved_leads) >= request.limit:
            break

        # Upsert: skip if already in DB
        existing = await Lead.find_one(
            Lead.name == biz["name"],
            Lead.city == biz["city"],
            Lead.niche == biz["niche"],
        )

        if existing:
            print(f"  ↩️  Already exists: {biz['name']}")
            saved_leads.append(LeadResponse.from_document(existing))
            continue

        # Analyze website if available
        analysis: dict = {}
        if biz.get("website"):
            print(f"  🌐 Analyzing: {biz['website']}")
            analysis = await analyze_website(biz["website"])

        if analysis:
            score, weaknesses = compute_score(analysis)
        else:
            score, weaknesses = 0, ["No website found — missing from the web entirely"]

        email = analysis.pop("email", None) or biz.get("email")

        lead = Lead(
            name=biz["name"],
            city=biz["city"],
            niche=biz["niche"],
            lat=biz.get("lat"),
            lon=biz.get("lon"),
            phone=biz.get("phone"),
            website=biz.get("website"),
            address=biz.get("address"),
            email=email,
            score=score,
            weaknesses=weaknesses,
            analyzed=bool(biz.get("website")),
            **{k: v for k, v in analysis.items() if k != "email"},
        )
        await lead.insert()
        print(f"  ✅ Saved: {biz['name']} (score={score}, website={'✓' if biz.get('website') else '✗'})")
        saved_leads.append(LeadResponse.from_document(lead))

    if not saved_leads:
        raise HTTPException(status_code=404, detail=f"No businesses found for '{niche}' in '{city}'.")

    duration_ms = int((time.monotonic() - start) * 1000)
    await SearchHistory(
        query=request.query,
        niche=niche,
        city=city,
        limit=request.limit,
        results_count=len(saved_leads),
        duration_ms=duration_ms,
    ).insert()

    return SearchResponse(
        query=request.query,
        niche=niche,
        city=city,
        results_count=len(saved_leads),
        duration_ms=duration_ms,
        leads=[lead.model_dump() for lead in saved_leads],
    )