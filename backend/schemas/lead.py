from pydantic import BaseModel, model_validator, ConfigDict
from typing import Optional, List, Any
from datetime import datetime


class LeadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str = ""
    name: str
    city: str
    niche: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None

    # Analysis
    loads: Optional[bool] = None
    https: Optional[bool] = None
    response_time_ms: Optional[int] = None
    has_title: Optional[bool] = None
    has_meta_description: Optional[bool] = None
    has_h1: Optional[bool] = None
    has_og_tags: Optional[bool] = None
    has_viewport_meta: Optional[bool] = None
    mobile_friendly: Optional[bool] = None
    social_links: List[str] = []

    # Lighthouse
    lighthouse_seo: Optional[float] = None
    lighthouse_performance: Optional[float] = None
    lighthouse_accessibility: Optional[float] = None

    # Scoring
    score: Optional[int] = None
    weaknesses: List[str] = []

    # Outreach
    outreach_email: Optional[str] = None
    outreach_dm: Optional[str] = None
    outreach_pitch: Optional[str] = None

    # Meta
    saved: bool = False
    analyzed: bool = False
    outreach_generated: bool = False
    created_at: Optional[datetime] = None

    @staticmethod
    def from_document(doc) -> "LeadResponse":
        try:
            data = doc.model_dump()
        except AttributeError:
            data = doc.dict()
        data["id"] = str(doc.id)
        return LeadResponse(**data)


class LeadUpdate(BaseModel):
    saved: Optional[bool] = None
    email: Optional[str] = None
    phone: Optional[str] = None