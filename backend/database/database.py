# database/database.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Define all collections here
events_collection = db["events"]
volunteers_collection = db["volunteers"]
organizations_collection = db["organizations"]
refresh_tokens_collection = db["refresh_tokens"]