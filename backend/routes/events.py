import os
import logging
import httpx
from fastapi import HTTPException
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("[%(asctime)s] %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# DeepSeek API configuration
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/analyze"

async def get_social_impact_score(description: str) -> float:
    """
    Retrieve the social impact score using the DeepSeek API.
    """
    if not description.strip():
        logger.error("Empty description provided for social impact analysis")
        raise HTTPException(status_code=400, detail="Description must not be empty")
    
    try:
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "text": description,
            "analysis_type": "social_impact"  # Update if the API requires a different type
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(DEEPSEEK_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            result = response.json()
            score = float(result.get("score", 0.0))
            logger.info("Retrieved social impact score: %s", score)
            return score
    except httpx.HTTPStatusError as e:
        logger.error("DeepSeek API request failed: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to get social impact score from DeepSeek API")
    except Exception as e:
        logger.error("Unexpected error in get_social_impact_score: %s", str(e))
        raise HTTPException(status_code=500, detail="Unexpected error occurred while calculating social impact score")

def calculate_impact_points(social_impact_score: float, duration_hours: float) -> int:
    """
    Calculate the impact-related XP points.
    Formula: Impact Points = (social_impact_score * 10) * duration_hours
    """
    if duration_hours <= 0:
        logger.error("Invalid duration hours: %s", duration_hours)
        raise HTTPException(status_code=400, detail="Duration hours must be greater than zero")
    impact_points = int((social_impact_score * 10) * duration_hours)
    logger.info("Calculated impact points: %s", impact_points)
    return impact_points

def calculate_total_xp(base_xp: int, impact_points: int) -> int:
    """
    Add fixed base XP to the impact points to get the total XP.
    """
    total_xp = base_xp + impact_points
    logger.info("Total XP (base %s + impact %s): %s", base_xp, impact_points, total_xp)
    return total_xp

async def calculate_and_assign_xp_points(event_description: str, duration_hours: float, base_xp: int = 10) -> int:
    """
    Calculate total XP points by:
      1. Retrieving the social impact score,
      2. Calculating impact points based on volunteer hours,
      3. Adding a fixed base XP.
    """
    social_impact_score = await get_social_impact_score(event_description)
    impact_points = calculate_impact_points(social_impact_score, duration_hours)
    total_xp = calculate_total_xp(base_xp, impact_points)
    return total_xp