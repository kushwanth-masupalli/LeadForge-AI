from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional

class SearchHistory(Document):
    """Search history document model for tracking search queries"""
    
    query: str
    city: str
    niche: str
    total_results: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "search_history"  # MongoDB collection name
    
    def __repr__(self):
        return f"SearchHistory(id={self.id}, query='{self.query}', results={self.total_results})"
    
    def __str__(self):
        return f"{self.query} - {self.total_results} results"
    
    @property
    def id_str(self) -> str:
        """String representation of ID"""
        return str(self.id) if self.id else ""
    
    def to_dict(self):
        """Convert to dictionary (useful for serialization)"""
        return {
            "_id": str(self.id) if self.id else None,
            "query": self.query,
            "city": self.city,
            "niche": self.niche,
            "total_results": self.total_results,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }