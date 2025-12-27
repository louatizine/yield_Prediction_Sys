from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from models.disease import DiseaseDetectionResponse, get_recommendation
from models.user import UserResponse
from utils.auth import get_current_user
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
