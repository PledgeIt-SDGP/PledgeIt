from fastapi import APIRouter, Request
from authlib.integrations.starlette_client import OAuth

# Create a router for authentication routes
router = APIRouter()

# Set up OAuth instance
oauth = OAuth()

# Register Google OAuth
oauth.register(
    name='google',
    client_id='CLIENT_ID',
    client_secret='CLIENT_SECRET',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    client_kwargs={"scope": "openid email profile"},  # ✅ Add required scope
    redirect_uri='http://127.0.0.1:8000/auth/callback',  # ✅ Must match Google Console
)

# Google OAuth login route
@router.get('/auth/google')
async def login_via_google(request: Request):
    redirect_uri = "http://127.0.0.1:8000/auth/callback"  # ✅ Explicitly set redirect URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

# Google OAuth callback route
@router.get('/auth/callback')
async def auth_callback(request: Request):
    google_token = await oauth.google.authorize_access_token(request)
    user = await oauth.google.parse_id_token(request, google_token)
    
    return {"user_info": user}
