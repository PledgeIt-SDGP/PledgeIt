from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = "pledgeit_database"

client = AsyncIOMotorClient(MONGO_URI)
database = client[DATABASE_NAME]
events_collection = database.get_collection("events")
