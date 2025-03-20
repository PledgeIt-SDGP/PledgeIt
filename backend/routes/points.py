import os
import logging
import httpx
from fastapi import HTTPException
from datetime import datetime
from dotenv import load_dotenv

#Load environment variables
load_dotenv()

# Connfigure logging
logging.basicConfig(level=logging.INFO)

#Deepseek API Key
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/analyze" 