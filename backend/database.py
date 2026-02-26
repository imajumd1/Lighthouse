from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import settings

# Global database client and database instances
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongodb():
    """Connect to MongoDB Atlas."""
    global client, db
    try:
        client = AsyncIOMotorClient(settings.mongodb_uri)
        db = client.lighthouse_db
        # Test the connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise


async def close_mongodb_connection():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("✅ MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance."""
    if db is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongodb first.")
    return db
