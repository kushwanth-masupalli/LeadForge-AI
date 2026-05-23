from pydantic import BaseModel, Field, field_validator
from typing import Optional
from config import settings


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Raw user query, e.g. 'restaurants in Hyderabad'")
    niche: Optional[str] = Field(None, description="Parsed niche (overrides query parsing)")
    city: Optional[str] = Field(None, description="Parsed city (overrides query parsing)")
    limit: int = Field(default=settings.default_result_limit, ge=1, le=50)

    @field_validator("query")
    @classmethod
    def strip_query(cls, v: str) -> str:
        return v.strip()


class SearchResponse(BaseModel):
    query: str
    niche: str
    city: str
    results_count: int
    duration_ms: int
    leads: list