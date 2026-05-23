from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from models.lead import Lead
from schemas.lead import LeadResponse
from services.outreach import generate_outreach

router = APIRouter()


@router.post("/outreach/{lead_id}", response_model=LeadResponse)
async def create_outreach(lead_id: str):
    lead = await Lead.get(lead_id)

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead.score is None:
        raise HTTPException(
            status_code=400,
            detail="Lead must be analyzed before generating outreach. Run /analyze/{lead_id} first.",
        )

    outreach = await generate_outreach(
        name=lead.name,
        website=lead.website,
        score=lead.score,
        weaknesses=lead.weaknesses,
        niche=lead.niche,
        city=lead.city,
    )

    if not any(outreach.values()):
        raise HTTPException(
            status_code=503,
            detail="AI provider failed to generate outreach. Check API key and try again.",
        )

    await lead.set(
        {
            **outreach,
            "outreach_generated": True,
            "updated_at": datetime.now(timezone.utc),
        }
    )

    return LeadResponse.from_document(lead)