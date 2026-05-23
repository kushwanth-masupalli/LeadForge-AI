from typing import Optional
import io

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from models.lead import Lead
from utils.export import leads_to_csv

router = APIRouter()


@router.get("/export/csv")
async def export_csv(
    city: Optional[str] = Query(None),
    niche: Optional[str] = Query(None),
    saved: Optional[bool] = Query(None),
    min_score: Optional[int] = Query(None, ge=0, le=100),
    max_score: Optional[int] = Query(None, ge=0, le=100),
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

    leads = await Lead.find(query_filter).sort("-created_at").to_list()

    csv_bytes = leads_to_csv(leads)

    filename = "leadforge_leads"

    if city:
        filename += f"_{city.lower().replace(' ', '_')}"

    if niche:
        filename += f"_{niche.lower().replace(' ', '_')}"

    filename += ".csv"

    return StreamingResponse(
        io.BytesIO(csv_bytes),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )