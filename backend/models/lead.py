from beanie import Document
from pydantic import Field
from typing import Optional, List
from datetime import datetime, timezone


class Lead(Document):
    # Identity
    name: str
    city: str
    niche: str

    # Contact
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None

    # Location
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
    social_links: List[str] = Field(default_factory=list)

    # Lighthouse
    lighthouse_seo: Optional[float] = None
    lighthouse_performance: Optional[float] = None
    lighthouse_accessibility: Optional[float] = None

    # Scoring
    score: Optional[int] = None
    weaknesses: List[str] = Field(default_factory=list)

    # AI Outreach
    outreach_email: Optional[str] = None
    outreach_dm: Optional[str] = None
    outreach_pitch: Optional[str] = None

    # Meta
    saved: bool = False
    analyzed: bool = False
    outreach_generated: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "leads"
        indexes = [
            "city",
            "niche",
            "score",
            "saved",
            "created_at",
        ]