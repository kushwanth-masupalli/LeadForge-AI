from typing import Optional, Literal

from fastapi import APIRouter, HTTPException, Query

from models.lead import Lead
from schemas.lead import LeadResponse, LeadUpdate

router = APIRouter()


@router.get("/leads", response_model=list[LeadResponse])
async def list_leads(
    city: Optional[str] = Query(None),
    niche: Optional[str] = Query(None),
    saved: Optional[bool] = Query(None),
    min_score: Optional[int] = Query(None, ge=0, le=100),
    max_score: Optional[int] = Query(None, ge=0, le=100),
    sort_by: Literal["score", "created_at", "name"] = Query("created_at"),
    sort_order: Literal["asc", "desc"] = Query("desc"),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
):
    query_filter = {}

    if city:
        query_filter["city"] = {"$regex": city, "$options": "i"}

    if niche:
        query_filter["niche"] = {"$regex": niche, "$options": "i"}

    if saved is not None:
        query_filter["saved"] = saved

    if min_score is not None:
        query_filter.setdefault("score", {})["$gte"] = min_score

    if max_score is not None:
        query_filter.setdefault("score", {})["$lte"] = max_score

    sort_field = f"+{sort_by}" if sort_order == "asc" else f"-{sort_by}"

    leads = await Lead.find(query_filter).sort(sort_field).skip(skip).limit(limit).to_list()

    return [LeadResponse.from_document(lead) for lead in leads]


@router.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: str):
    lead = await Lead.get(lead_id)

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    return LeadResponse.from_document(lead)


@router.patch("/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(lead_id: str, update: LeadUpdate):
    lead = await Lead.get(lead_id)

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    update_data = update.model_dump(exclude_none=True)

    if update_data:
        await lead.set(update_data)

    return LeadResponse.from_document(lead)


@router.post("/leads/{lead_id}/save", response_model=LeadResponse)
async def toggle_save(lead_id: str):
    lead = await Lead.get(lead_id)

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    await lead.set({"saved": not lead.saved})

    return LeadResponse.from_document(lead)


@router.delete("/leads/{lead_id}", status_code=204)
async def delete_lead(lead_id: str):
    lead = await Lead.get(lead_id)

    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    await lead.delete()