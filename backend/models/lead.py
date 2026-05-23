from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional, List

class Lead(Document):
    """Lead document model for storing business leads"""
    
    company_name: str
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: str
    niche: str
    score: int = 0
    https: bool = False
    mobile_friendly: bool = False
    has_seo_tags: bool = False
    social_links: List[str] = []
    weaknesses: List[str] = []
    outreach_email: Optional[str] = None
    outreach_dm: Optional[str] = None
    is_saved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "leads"  # MongoDB collection name
        
    def __repr__(self):
        return f"Lead(id={self.id}, company_name='{self.company_name}', score={self.score})"
    
    def __str__(self):
        return f"{self.company_name} - {self.city} - Score: {self.score}"
    
    @property
    def id_str(self) -> str:
        """String representation of ID"""
        return str(self.id) if self.id else ""
    
    def to_dict(self):
        """Convert to dictionary (useful for serialization)"""
        return {
            "_id": str(self.id) if self.id else None,
            "company_name": self.company_name,
            "website": self.website,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "niche": self.niche,
            "score": self.score,
            "https": self.https,
            "mobile_friendly": self.mobile_friendly,
            "has_seo_tags": self.has_seo_tags,
            "social_links": self.social_links,
            "weaknesses": self.weaknesses,
            "outreach_email": self.outreach_email,
            "outreach_dm": self.outreach_dm,
            "is_saved": self.is_saved,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }