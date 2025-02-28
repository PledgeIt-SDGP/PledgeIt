from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes.events import router as event_router
import os


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
    }
