from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SearchRequest(BaseModel):
    """Request model for search endpoint"""
    niche: str = Field(..., description="Business niche (e.g., restaurants, plumbers)")
    city: str = Field(..., description="City to search in")
    limit: int = Field(50, description="Maximum number of results to return")
    
class SearchResponse(BaseModel):
    """Response model for search endpoint"""
    leads: List[dict]
    total_count: int
    query: str
    executed_at: datetime

class LeadResponse(BaseModel):
    """Response model for lead endpoint"""
    id: str
    company_name: str
    website: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    city: str
    niche: str
    score: int
    https: bool
    mobile_friendly: bool
    has_seo_tags: bool
    social_links: List[str]
    weaknesses: List[str]
    outreach_email: Optional[str]
    outreach_dm: Optional[str]
    is_saved: bool
    created_at: datetime

class LeadUpdateRequest(BaseModel):
    """Request model for updating lead"""
    is_saved: Optional[bool] = None
    outreach_email: Optional[str] = None
    outreach_dm: Optional[str] = None

class AnalyticsResponse(BaseModel):
    """Response model for analytics endpoint"""
    total_leads: int
    saved_leads: int
    average_score: float
    recent_searches: List[dict]
    top_cities: List[dict]
    top_niches: List[dict]