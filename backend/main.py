from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.predictions import router as predictions_router
from routes.disease import router as disease_router
from utils.database import connect_to_mongo, close_mongo_connection
from services.ml_model import ml_service
from services.disease_detection import disease_service
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(title="AgriDoctor API", description="Smart Agriculture Prediction System")

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    # Load ML models at startup
    ml_service.load_model()
    disease_service.load_model()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(predictions_router, tags=["Predictions"])
app.include_router(disease_router, tags=["Disease Detection"])

@app.get("/")
async def root():
    return {"message": "AgriDoctor API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
