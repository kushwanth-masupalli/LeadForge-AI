from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime, timezone


class SearchHistory(Document):
    query: str
    niche: str
    city: str
    limit: int
    results_count: int
    duration_ms: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "search_history"
        indexes = ["created_at", "city", "niche"]