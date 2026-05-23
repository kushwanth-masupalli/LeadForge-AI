import httpx
import asyncio
from typing import List, Optional, Dict
from datetime import datetime
from schemas.search import SearchResult
from config import get_database
from models import Lead
from database import DatabaseOperations

class OverpassService:
    """Service for fetching business data from Overpass API"""
    
    OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def search_businesses(self, niche: str, city: str, limit: int = 50) -> List[SearchResult]:
        """
        Search for businesses in a specific niche and city using Overpass API
        
        Args:
            niche: Business niche (e.g., "restaurant", "plumber")
            city: City to search in
            limit: Maximum number of results
            
        Returns:
            List of search results
        """
        try:
            # Build Overpass QL query
            query = f"""
            [out:json][timeout:60];
            (
              area["name"="{city}"]->.searchArea;
              (
                node["amenity"="{niche}"](area.searchArea);
                way["amenity"="{niche}"](area.searchArea);
                relation["amenity"="{niche}"](area.searchArea);
                node["shop"="{niche}"](area.searchArea);
                way["shop"="{niche}"](area.searchArea);
                relation["shop"="{niche}"](area.searchArea);
              );
              out body;
              >;
              out skel qt;
            );
            """
            
            response = await self.client.post(self.OVERPASS_API_URL, data=query)
            response.raise_for_status()
            data = response.json()
            
            # Parse results
            results = []
            for element in data.get("elements", []):
                if element.get("type") == "node" and "tags" in element:
                    tags = element["tags"]
                    result = SearchResult(
                        name=tags.get("name", f"{niche.title()} {element['id']}"),
                        lat=element["lat"],
                        lon=element["lon"],
                        website=tags.get("website"),
                        phone=tags.get("phone"),
                        address=tags.get("addr:street"),
                        city=city
                    )
                    results.append(result)
            
            # Limit results
            return results[:limit]
            
        except httpx.HTTPError as e:
            print(f"Overpass API error: {e}")
            return []
        except Exception as e:
            print(f"Error searching businesses: {e}")
            return []
    
    async def save_leads_to_database(self, results: List[SearchResult], niche: str, city: str):
        """
        Save search results to database as Lead documents
        
        Args:
            results: List of search results
            niche: Business niche
            city: City
        """
        try:
            db = get_database()
            
            for result in results:
                # Check if lead already exists
                existing_lead = await db.leads.find_one({
                    "company_name": result.name,
                    "city": city,
                    "niche": niche
                })
                
                if not existing_lead:
                    lead = Lead(
                        company_name=result.name,
                        website=result.website,
                        phone=result.phone,
                        address=result.address,
                        city=city,
                        niche=niche,
                        score=0,  # Will be calculated after analysis
                        https=False,
                        mobile_friendly=False,
                        has_seo_tags=False,
                        social_links=[],
                        weaknesses=[]
                    )
                    await lead.insert()
                    
        except Exception as e:
            print(f"Error saving leads to database: {e}")
    
    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()