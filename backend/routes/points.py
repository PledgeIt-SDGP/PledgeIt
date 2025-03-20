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

async def get_social_impact_score(description: str) -> float:
    """
    Get the social impact score from the event description using the DeepSeek API.
    """
    try:
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "text": description,
            "analysis_type": "social_impact"  # Replace with the actual analysis type
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(DEEPSEEK_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            result = response.json()
            
            # Extract the social impact score from the response
            social_impact_score = result.get("score", 0.0)
            return social_impact_score
    
    except httpx.HTTPStatusError as e:
        logging.error(f"DeepSeek API request failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get social impact score from DeepSeek API")
    except Exception as e:
        logging.error(f"Unexpected error in get_social_impact_score: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error occurred while calculating social impact score")

def calculate_xp_points(social_impact_score: float, duration_hours: float) -> int:
    """
    Calculate XP points based on the social impact score and event duration.
    XP Points = (Social Impact Score * 10) + (Duration in Hours * 2)
    """
    xp_points = int((social_impact_score * 10) * (duration_hours))
    return xp_points

async def calculate_and_assign_xp_points(event_description: str, duration_hours: float) -> int:
    """
    Calculate and assign XP points for an event.
    """
    try:
        # Get the social impact score from the event description
        social_impact_score = await get_social_impact_score(event_description)
        
        # Calculate XP points
        xp_points = calculate_xp_points(social_impact_score, duration_hours)
        
        return xp_points
    
    except Exception as e:
        logging.error(f"Error in calculate_and_assign_xp_points: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate XP points")
            