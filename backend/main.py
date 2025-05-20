from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from fastapi.staticfiles import StaticFiles
from routes.events import router as event_router
from routes.auth import router as auth_router
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get secret key and port from environment variables
SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
PORT = int(os.environ.get("PORT", 8000))  # Render provides PORT

app = FastAPI(
    title="PledgeIt Volunteer Events API",
    description="API for managing volunteer events, including event creation, filtering, geocoding, and image uploads.",
    version="1.0.0",
)

# Configure CORS (adjust allowed origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

# Configure SessionMiddleware
app.add_middleware(
    SessionMiddleware, secret_key=SECRET_KEY
)

# Ensure the uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(event_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to the PledgeIt Volunteer Events API",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "volunteer_register": "/auth/volunteer/register",
        "organization_register": "/auth/organization/register",
    }

# Add this block to run Uvicorn programmatically
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)