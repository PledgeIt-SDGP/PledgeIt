from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.events import router as event_router

app = FastAPI()

# Allow frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(event_router)

@app.get("/")
def root():
    return {"message": "Welcome to the PledgeIt Volunteer Events API"}
