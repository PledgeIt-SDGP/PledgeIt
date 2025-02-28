from fastapi import FastAPI, APIRouter, Request
from authlib.integrations.starlette_client import OAuth
import os
from dotenv import load_dotenv
import httpx

# Initialize FastAPI app
app = FastAPI()

# Create a router for authentication routes
router = APIRouter()

# Set up OAuth instance
oauth = OAuth()

load_dotenv()  # Load environment variables from .env file

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')

# Register Google OAuth
oauth.register(
    name='google',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    client_kwargs={"scope": "openid email profile"},
    redirect_uri='http://127.0.0.1:8000/auth/callback'
)

# Google OAuth login route
@router.get('/auth/google')
async def login_via_google(request: Request):
    redirect_uri = "http://127.0.0.1:8000/auth/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)

# Google OAuth callback route
@router.get('/auth/callback')
async def auth_callback(request: Request):
    try:
        google_token = await oauth.google.authorize_access_token(request)
        user = await oauth.google.parse_id_token(request, google_token)
        return {"user_info": user}
    except Exception as e:
        return {"error": "Authentication failed", "message": str(e)}

# Include the router in the FastAPI app
app.include_router(router)
