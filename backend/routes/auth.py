from fastapi import APIRouter, Request
from authlib.integrations.starlette_client import OAuth
import os
from dotenv import load_dotenv
import httpx  # ✅ Import this to make requests

# Create a router for authentication routes
router = APIRouter()

# Load environment variables
load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')

# Initialize OAuth with Google
oauth = OAuth()
oauth.register(
    name='google',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',  # ✅ Add this
    client_kwargs={"scope": "email profile"},
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
        print("🔹 Google Token Response:", google_token)  # ✅ Debugging line

        async with httpx.AsyncClient() as client:
            user_info = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",  # ✅ Fixed user info URL
                headers={"Authorization": f"Bearer {google_token['access_token']}"}
            )

        user = user_info.json()
        return {"user_info": user}

    except Exception as e:
        return {"error": "Authentication failed", "message": str(e)}