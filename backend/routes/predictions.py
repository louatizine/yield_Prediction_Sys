from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict
from models.prediction import (
    CropPredictionInput, 
    CropPredictionResponse,
    FertilizerPredictionInput,
    FertilizerPredictionResponse,
    CROP_MAPPING,
    FERTILIZER_MAPPING,
    FERTILIZER_EXPLANATIONS
)
from models.user import UserResponse
from utils.auth import get_current_user
from services.ml_model import ml_service

router = APIRouter(prefix="/api/predict", tags=["Predictions"])

@router.post("/crop", response_model=CropPredictionResponse)
async def predict_crop(
    input_data: CropPredictionInput,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Predict the best crop to grow based on soil and climate conditions
    
    Requires authentication. Returns recommended crop based on:
    - Soil nutrients (N, P, K)
    - Climate factors (temperature, humidity, rainfall)
    - Soil pH
    """
    try:
        # Prepare features in the exact order expected by the model
        features = [
            input_data.N,
            input_data.P,
            input_data.K,
            input_data.temperature,
            input_data.humidity,
            input_data.ph,
            input_data.rainfall
        ]
        
        # Get prediction from model
        crop_id = ml_service.predict_crop(features)
        
        # Map prediction to crop name
        crop_name = CROP_MAPPING.get(crop_id, "Unknown Crop")
        
        return CropPredictionResponse(
            success=True,
            crop=crop_name,
            crop_id=crop_id,
            message=f"Based on the provided soil and climate conditions, {crop_name} is recommended for cultivation."
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

@router.post("/fertilizer", response_model=FertilizerPredictionResponse)
async def predict_fertilizer(
    input_data: FertilizerPredictionInput,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Predict the best fertilizer for the given soil conditions and crop
    
    Requires authentication. Returns recommended fertilizer based on:
    - Current soil nutrient levels (N, P, K)
    - Climate conditions
    - Soil pH
    - Crop type being grown
    """
    try:
        # Encode crop type (simplified - in production, use proper encoding)
        crop_types = list(CROP_MAPPING.values())
        crop_type_encoded = crop_types.index(input_data.crop_type.title()) if input_data.crop_type.title() in crop_types else 0
        
        # Prepare features
        features = [
            input_data.N,
            input_data.P,
            input_data.K,
            input_data.temperature,
            input_data.humidity,
            input_data.ph,
            input_data.rainfall,
            crop_type_encoded
        ]
        
        # Get prediction from model
        fertilizer_id = ml_service.predict_fertilizer(features)
        
        # Map prediction to fertilizer name
        fertilizer_name = FERTILIZER_MAPPING.get(fertilizer_id, "10-26-26")
        explanation = FERTILIZER_EXPLANATIONS.get(fertilizer_name, "Recommended for optimal crop growth.")
        
        return FertilizerPredictionResponse(
            success=True,
            fertilizer=fertilizer_name,
            fertilizer_id=fertilizer_id,
            explanation=explanation,
            message=f"Based on your soil analysis and crop type ({input_data.crop_type}), {fertilizer_name} fertilizer is recommended."
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Check if the ML model is loaded and ready"""
    if ml_service.model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model not loaded"
        )
    
    return {
        "status": "healthy",
        "model_loaded": True,
        "message": "XGBoost model is ready for predictions"
    }
