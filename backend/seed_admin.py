"""Seed script to create an admin user in the database."""

import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

from config import settings
from utils.auth import hash_password


async def seed_admin():
    """Create admin user if it doesn't exist."""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client.lighthouse_db
    
    try:
        # Check if admin already exists
        existing_admin = await db.users.find_one({"email": "admin@lighthouse.com"})
        
        if existing_admin:
            print("✅ Admin user already exists")
            return
        
        # Create admin user
        admin_doc = {
            "name": "Admin User",
            "email": "admin@lighthouse.com",
            "password_hash": hash_password("admin123"),
            "role": "admin",
            "avatar": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "deleted_at": None
        }
        
        result = await db.users.insert_one(admin_doc)
        print(f"✅ Admin user created with ID: {result.inserted_id}")
        print("   Email: admin@lighthouse.com")
        print("   Password: admin123")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(seed_admin())
