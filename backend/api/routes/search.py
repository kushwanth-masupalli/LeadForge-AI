from fastapi import APIRouter, HTTPException, Depends
from typing import List
from schemas.search import SearchRequest, SearchResponse, SearchResult, SearchHistoryResponse
from services.overpass import OverpassService
from models import SearchHistory
from database import DatabaseOperations
from datetime import datetime

router = APIRouter(prefix="/api", tags=["search"])

@router.post("/search")
async def search_businesses(
    request: SearchRequest,
    overpass_service: OverpassService = Depends()
) -> SearchResponse:
    """
    Search for businesses using Overpass API
    
    Args:
        request: Search request containing niche and city
        overpass_service: Overpass service instance
        
    Returns:
        Search response with business results
    """
    try:
        # Search for businesses
        results = await overpass_service.search_businesses(
            niche=request.niche,
            city=request.city,
            limit=request.limit
        )
        
        # Save to search history
        search_history = SearchHistory(
            query=f"{request.niche} in {request.city}",
            city=request.city,
            niche=request.niche,
            total_results=len(results)
        )
        await search_history.insert()
        
        # Save leads to database
        await overpass_service.save_leads_to_database(results, request.niche, request.city)
        
        return SearchResponse(
            results=results,
            total_count=len(results),
            query=f"{request.niche} in {request.city}",
            executed_at=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/history")
async def get_search_history() -> SearchHistoryResponse:
    """
    Get search history
    
    Returns:
        List of recent searches
    """
    try:
        searches = await DatabaseOperations.find_many(
            "search_history",
            {},
            limit=20,
            skip=0
        )
        
        return SearchHistoryResponse(
            searches=searches,
            total_count=len(searches)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))