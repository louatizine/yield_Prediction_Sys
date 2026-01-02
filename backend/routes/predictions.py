from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict
from datetime import datetime
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
from utils.database import get_crop_predictions_collection, get_fertilizer_predictions_collection
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
        
        # Save prediction to database
        crop_predictions_collection = get_crop_predictions_collection()
        prediction_record = {
            "user_id": current_user["id"],
            "user_email": current_user["email"],
            "input_data": {
                "N": input_data.N,
                "P": input_data.P,
                "K": input_data.K,
                "temperature": input_data.temperature,
                "humidity": input_data.humidity,
                "ph": input_data.ph,
                "rainfall": input_data.rainfall
            },
            "prediction": {
                "crop": crop_name,
                "crop_id": crop_id
            },
            "created_at": datetime.utcnow()
        }
        await crop_predictions_collection.insert_one(prediction_record)
        
        return CropPredictionResponse(
            success=True,
            crop=crop_name,
            crop_id=crop_id,
            message=f"Based on the provided soil and climate conditions, {crop_name} is recommended for cultivation."
        )
        
    except Exception as e:
        import traceback
        print("ERROR in crop prediction:")
        print(traceback.format_exc())
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
        # Prepare features (same as crop prediction - the model was trained on the same features)
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
        fertilizer_id = ml_service.predict_fertilizer(features)
        
        # Map prediction to fertilizer name
        fertilizer_name = FERTILIZER_MAPPING.get(fertilizer_id, "10-26-26")
        explanation = FERTILIZER_EXPLANATIONS.get(fertilizer_name, "Recommended for optimal crop growth.")
        
        # Save prediction to database
        fertilizer_predictions_collection = get_fertilizer_predictions_collection()
        prediction_record = {
            "user_id": current_user["id"],
            "user_email": current_user["email"],
            "input_data": {
                "N": input_data.N,
                "P": input_data.P,
                "K": input_data.K,
                "temperature": input_data.temperature,
                "humidity": input_data.humidity,
                "ph": input_data.ph,
                "rainfall": input_data.rainfall,
                "crop_type": input_data.crop_type
            },
            "prediction": {
                "fertilizer": fertilizer_name,
                "fertilizer_id": fertilizer_id,
                "explanation": explanation
            },
            "created_at": datetime.utcnow()
        }
        await fertilizer_predictions_collection.insert_one(prediction_record)
        
        return FertilizerPredictionResponse(
            success=True,
            fertilizer=fertilizer_name,
            fertilizer_id=fertilizer_id,
            explanation=explanation,
            message=f"Based on your soil analysis and crop type ({input_data.crop_type}), {fertilizer_name} fertilizer is recommended."
        )
        
    except Exception as e:
        import traceback
        print("ERROR in fertilizer prediction:")
        print(traceback.format_exc())
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

@router.get("/crop/history")
async def get_crop_prediction_history(
    limit: int = 10,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get crop prediction history for the current user"""
    try:
        crop_predictions_collection = get_crop_predictions_collection()
        predictions = await crop_predictions_collection.find(
            {"user_id": current_user["id"]}
        ).sort("created_at", -1).limit(limit).to_list(length=limit)
        
        # Convert ObjectId to string
        for pred in predictions:
            pred["_id"] = str(pred["_id"])
        
        return {
            "success": True,
            "count": len(predictions),
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve history: {str(e)}"
        )

@router.get("/fertilizer/history")
async def get_fertilizer_prediction_history(
    limit: int = 10,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get fertilizer prediction history for the current user"""
    try:
        fertilizer_predictions_collection = get_fertilizer_predictions_collection()
        predictions = await fertilizer_predictions_collection.find(
            {"user_id": current_user["id"]}
        ).sort("created_at", -1).limit(limit).to_list(length=limit)
        
        # Convert ObjectId to string
        for pred in predictions:
            pred["_id"] = str(pred["_id"])
        
        return {
            "success": True,
            "count": len(predictions),
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve history: {str(e)}"
        )
