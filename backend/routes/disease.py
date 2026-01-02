from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from datetime import datetime
from models.disease import DiseaseDetectionResponse, get_recommendation
from models.user import UserResponse
from utils.auth import get_current_user
from utils.database import get_disease_detections_collection
from services.disease_detection import disease_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/disease", tags=["Disease Detection"])

@router.post("/detect", response_model=DiseaseDetectionResponse)
async def detect_disease(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Detect plant disease from uploaded image
    
    Requires authentication. Upload an image of a plant leaf to detect diseases.
    Supports: Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, 
             Potato, Raspberry, Soybean, Squash, Strawberry, Tomato
    """
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image (JPEG, PNG, etc.)"
        )
    
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        # Validate file size (max 10MB)
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file too large. Maximum size is 10MB."
            )
        
        # Get prediction
        result = disease_service.predict_disease(image_bytes)
        
        # Add recommendation
        recommendation = get_recommendation(result['disease'])
        
        # Build response message
        if result['is_healthy']:
            message = f"Great news! Your {result['plant']} plant appears to be healthy."
        else:
            message = f"Disease detected: {result['disease']} in {result['plant']} plant (Confidence: {result['confidence']:.1%})"
        
        # Save detection to database
        disease_detections_collection = get_disease_detections_collection()
        detection_record = {
            "user_id": current_user["id"],
            "user_email": current_user["email"],
            "filename": file.filename,
            "content_type": file.content_type,
            "detection": {
                "plant": result['plant'],
                "disease": result['disease'],
                "confidence": result['confidence'],
                "is_healthy": result['is_healthy'],
                "top_predictions": result['top_predictions']
            },
            "recommendation": recommendation,
            "created_at": datetime.utcnow()
        }
        await disease_detections_collection.insert_one(detection_record)
        
        return DiseaseDetectionResponse(
            success=result['success'],
            plant=result['plant'],
            disease=result['disease'],
            confidence=result['confidence'],
            is_healthy=result['is_healthy'],
            top_predictions=result['top_predictions'],
            message=message,
            recommendation=recommendation
        )
        
    except Exception as e:
        logger.error(f"Disease detection error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process image: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Check if the disease detection model is loaded and ready"""
    if disease_service.model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Disease detection model not loaded"
        )
    
    return {
        "status": "healthy",
        "model_loaded": True,
        "message": "ResNet18 disease detection model is ready",
        "supported_plants": [
            "Apple", "Blueberry", "Cherry", "Corn", "Grape", "Orange", 
            "Peach", "Pepper", "Potato", "Raspberry", "Soybean", 
            "Squash", "Strawberry", "Tomato"
        ]
    }

@router.get("/history")
async def get_disease_detection_history(
    limit: int = 10,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get disease detection history for the current user"""
    try:
        disease_detections_collection = get_disease_detections_collection()
        detections = await disease_detections_collection.find(
            {"user_id": current_user["id"]}
        ).sort("created_at", -1).limit(limit).to_list(length=limit)
        
        # Convert ObjectId to string
        for detection in detections:
            detection["_id"] = str(detection["_id"])
        
        return {
            "success": True,
            "count": len(detections),
            "detections": detections
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve history: {str(e)}"
        )
