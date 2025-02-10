from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import router
import uvicorn

app = FastAPI()

# Enable CORS so frontend can access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Welcome to the PledgeIt Volunteer API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
