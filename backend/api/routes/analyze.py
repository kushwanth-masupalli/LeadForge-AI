from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from models.lead import Lead
from schemas.lead import LeadResponse
from services.analyzer import analyze_website
from services.scorer import compute_score

router = APIRouter()


@router.post("/analyze/{lead_id}", response_model=LeadResponse)
async def analyze_lead(lead_id: str):
    lead = await Lead.get(lead_id)

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if not lead.website:
        raise HTTPException(status_code=400, detail="Lead has no website to analyze")

    analysis = await analyze_website(lead.website)
    score, weaknesses = compute_score(analysis)

    update_fields = {
        **analysis,
        "score": score,
        "weaknesses": weaknesses,
        "analyzed": True,
        "updated_at": datetime.now(timezone.utc),
    }

    if not analysis.get("email") and lead.email:
        update_fields.pop("email", None)

    await lead.set(update_fields)

    return LeadResponse.from_document(lead)


@router.post("/analyze/bulk", response_model=list[LeadResponse])
async def bulk_analyze(lead_ids: list[str]):
    if len(lead_ids) > 20:
        raise HTTPException(
            status_code=400,
            detail="Bulk analyze is limited to 20 leads at a time",
        )

    results = []

    for lead_id in lead_ids:
        lead = await Lead.get(lead_id)

        if not lead or not lead.website:
            continue

        try:
            analysis = await analyze_website(lead.website)
            score, weaknesses = compute_score(analysis)

            update_fields = {
                **analysis,
                "score": score,
                "weaknesses": weaknesses,
                "analyzed": True,
                "updated_at": datetime.now(timezone.utc),
            }

            if not analysis.get("email") and lead.email:
                update_fields.pop("email", None)

            await lead.set(update_fields)

            results.append(LeadResponse.from_document(lead))

        except Exception as exc:
            print(f"Bulk analyze failed for lead {lead_id}: {exc}")
            continue

    return results