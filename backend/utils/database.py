from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "yield_prediction_db")

class Database:
    client: AsyncIOMotorClient = None
    
db = Database()

async def connect_to_mongo():
    """Connect to MongoDB"""
    try:
        db.client = AsyncIOMotorClient(MONGODB_URL)
        # Test connection
        await db.client.admin.command('ping')
        print("✓ Connected to MongoDB Atlas successfully!")
    except ConnectionFailure as e:
        print(f"✗ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("✓ MongoDB connection closed")

def get_database():
    """Get database instance"""
    return db.client[DATABASE_NAME]

def get_users_collection():
    """Get users collection"""
    database = get_database()
    return database["users"]

def get_crop_predictions_collection():
    """Get crop predictions collection"""
    database = get_database()
    return database["crop_predictions"]

def get_fertilizer_predictions_collection():
    """Get fertilizer predictions collection"""
    database = get_database()
    return database["fertilizer_predictions"]

def get_disease_detections_collection():
    """Get disease detections collection"""
    database = get_database()
    return database["disease_detections"]
