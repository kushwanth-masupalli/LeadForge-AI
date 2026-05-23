from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SearchRequest(BaseModel):
    """Request model for search endpoint"""
    niche: str = Field(..., description="Business niche (e.g., restaurants, plumbers)")
    city: str = Field(..., description="City to search in")
    limit: int = Field(50, description="Maximum number of results to return")

class SearchResult(BaseModel):
    """Single search result from Overpass API"""
    name: str
    lat: float
    lon: float
    website: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: str

class SearchResponse(BaseModel):
    """Response model for search endpoint"""
    results: List[SearchResult]
    total_count: int
    query: str
    executed_at: datetime

class SearchHistoryResponse(BaseModel):
    """Response model for search history endpoint"""
    searches: List[dict]
    total_count: int