from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["pledgeit_database"]
collection = db["events"]

@app.get("/")
async def root():
    return {"message": "MongoDB Atlas connected successfully!"}
