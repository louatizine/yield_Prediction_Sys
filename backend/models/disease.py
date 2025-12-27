from pydantic import BaseModel
from typing import List, Optional

class DiseaseDetectionResponse(BaseModel):
    """Response schema for disease detection"""
    success: bool
    plant: str
    disease: str
    confidence: float
    is_healthy: bool
    top_predictions: List[dict]
    message: str
    recommendation: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "plant": "Tomato",
                "disease": "Early blight",
                "confidence": 0.95,
                "is_healthy": False,
                "top_predictions": [
                    {"disease": "Early blight", "plant": "Tomato", "confidence": 0.95},
                    {"disease": "Late blight", "plant": "Tomato", "confidence": 0.03},
                    {"disease": "healthy", "plant": "Tomato", "confidence": 0.01}
                ],
                "message": "Disease detected: Early blight in Tomato plant",
                "recommendation": "Apply fungicide and remove affected leaves"
            }
        }

# Disease treatment recommendations
DISEASE_RECOMMENDATIONS = {
    'Apple scab': 'Apply fungicide during wet periods. Remove fallen leaves and prune infected branches.',
    'Black rot': 'Remove infected fruit and leaves. Apply copper-based fungicides.',
    'Cedar apple rust': 'Remove nearby cedar trees if possible. Apply fungicides in early spring.',
    'Powdery mildew': 'Improve air circulation. Apply sulfur or potassium bicarbonate sprays.',
    'Common rust': 'Plant resistant varieties. Apply fungicides if severe.',
    'Northern Leaf Blight': 'Rotate crops and remove crop debris. Use resistant hybrids.',
    'Cercospora leaf spot Gray leaf spot': 'Rotate crops. Apply fungicides when symptoms first appear.',
    'Bacterial spot': 'Use disease-free seeds. Apply copper-based bactericides.',
    'Early blight': 'Remove infected leaves. Apply fungicides containing chlorothalonil.',
    'Late blight': 'Destroy infected plants immediately. Apply fungicides preventively.',
    'Leaf Mold': 'Improve ventilation. Reduce humidity in greenhouse.',
    'Septoria leaf spot': 'Remove infected leaves. Rotate crops. Apply fungicides.',
    'Spider mites Two-spotted spider mite': 'Spray with water. Use insecticidal soap or neem oil.',
    'Target Spot': 'Improve air circulation. Apply fungicides.',
    'Tomato Yellow Leaf Curl Virus': 'Control whiteflies. Remove infected plants.',
    'Tomato mosaic virus': 'Use virus-free seeds. Control aphids. Remove infected plants.',
    'Leaf blight': 'Remove infected leaves. Improve drainage. Apply fungicides.',
    'Esca Black Measles': 'Prune infected wood. There is no cure; focus on prevention.',
    'Leaf scorch': 'Ensure adequate watering. Mulch around plants.',
    'Haunglongbing Citrus greening': 'Remove infected trees. Control Asian citrus psyllid.'
}

def get_recommendation(disease_name: str) -> str:
    """Get treatment recommendation for a disease"""
    # Check for exact match first
    for key, value in DISEASE_RECOMMENDATIONS.items():
        if key.lower() in disease_name.lower():
            return value
    
    # Return general advice if no specific recommendation
    if 'healthy' in disease_name.lower():
        return 'Your plant looks healthy! Continue regular care and monitoring.'
    else:
        return 'Consult with a local agricultural expert for specific treatment recommendations.'
