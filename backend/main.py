from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from fastapi.staticfiles import StaticFiles
from routes.events import router as event_router
from routes.auth import router as auth_router  # Import the auth router
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get secret key from environment variables
SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')  # Default for development

app = FastAPI(
    title="PledgeIt Volunteer Events API",
    description="API for managing volunteer events, including event creation, filtering, geocoding, and image uploads.",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",  # Allow the frontend on localhost:5173
]

# Configure CORS (adjust allowed origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow only the frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Configure SessionMiddleware
app.add_middleware(
    SessionMiddleware, secret_key=SECRET_KEY
)

# Ensure the uploads directory exists for serving event images
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include event routes
app.include_router(event_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to the PledgeIt Volunteer Events API",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "volunteer_register": "/auth/volunteer/register",
        "organization_register": "/auth/organization/register",
    }

# Include OAuth routes (auth_router)
app.include_router(auth_router)