from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from config import settings
from models.lead import Lead
from models.search_history import SearchHistory


async def init_db():
    """Initialize Motor client and Beanie with all document models."""
    client = AsyncIOMotorClient(settings.mongodb_uri)
    database = client[settings.mongodb_db_name]

    await init_beanie(
        database=database,
        document_models=[Lead, SearchHistory],
    )

    print(f"✅ Connected to MongoDB: {settings.mongodb_db_name}")