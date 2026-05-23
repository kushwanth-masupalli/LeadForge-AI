import motor.motor_asyncio
from beanie import init_beanie
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import asyncio
from config import settings

# Global database client
client = None
database = None

async def init_database():
    """Initialize MongoDB connection and Beanie"""
    global client, database
    
    if not client:
        client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        database = client[settings.MONGODB_DB_NAME]
        
        # Initialize Beanie
        await init_beanie(
            database=database,
            document_models=[]
        )
        
        print(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")
        return database
    return database

async def close_database():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_database():
    """Get database instance"""
    if not database:
        raise RuntimeError("Database not initialized. Call init_database() first.")
    return database

class DatabaseOperations:
    """Helper class for common database operations"""
    
    @staticmethod
    async def find_one(collection: str, query: dict):
        """Find one document in collection"""
        db = get_database()
        return await db[collection].find_one(query)
    
    @staticmethod
    async def find_many(collection: str, query: dict, skip: int = 0, limit: int = 100):
        """Find many documents in collection"""
        db = get_database()
        return await db[collection].find(query).skip(skip).limit(limit).to_list(length=limit)
    
    @staticmethod
    async def insert_one(collection: str, document: dict):
        """Insert one document into collection"""
        db = get_database()
        result = await db[collection].insert_one(document)
        return result.inserted_id
    
    @staticmethod
    async def update_one(collection: str, query: dict, update: dict):
        """Update one document in collection"""
        db = get_database()
        result = await db[collection].update_one(query, {"$set": update})
        return result.modified_count
    
    @staticmethod
    async def delete_one(collection: str, query: dict):
        """Delete one document from collection"""
        db = get_database()
        result = await db[collection].delete_one(query)
        return result.deleted_id