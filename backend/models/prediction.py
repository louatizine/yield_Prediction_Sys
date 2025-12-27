from pydantic import BaseModel, Field, validator
from typing import Optional

class CropPredictionInput(BaseModel):
    """Input schema for crop recommendation prediction"""
    N: float = Field(..., ge=0, le=200, description="Nitrogen content in soil (kg/ha)")
    P: float = Field(..., ge=0, le=200, description="Phosphorous content in soil (kg/ha)")
    K: float = Field(..., ge=0, le=300, description="Potassium content in soil (kg/ha)")
    temperature: float = Field(..., ge=0, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity in %")
    ph: float = Field(..., ge=0, le=14, description="Soil pH value")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall in mm")
    
    class Config:
        json_schema_extra = {
            "example": {
                "N": 90,
                "P": 42,
                "K": 43,
                "temperature": 20.87,
                "humidity": 82.00,
                "ph": 6.50,
                "rainfall": 202.93
            }
        }

class FertilizerPredictionInput(BaseModel):
    """Input schema for fertilizer recommendation prediction"""
    N: float = Field(..., ge=0, le=200, description="Nitrogen content in soil (kg/ha)")
    P: float = Field(..., ge=0, le=200, description="Phosphorous content in soil (kg/ha)")
    K: float = Field(..., ge=0, le=300, description="Potassium content in soil (kg/ha)")
    temperature: float = Field(..., ge=0, le=60, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity in %")
    ph: float = Field(..., ge=0, le=14, description="Soil pH value")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall in mm")
    crop_type: str = Field(..., description="Type of crop to be grown")
    
    class Config:
        json_schema_extra = {
            "example": {
                "N": 90,
                "P": 42,
                "K": 43,
                "temperature": 20.87,
                "humidity": 82.00,
                "ph": 6.50,
                "rainfall": 202.93,
                "crop_type": "rice"
            }
        }

class CropPredictionResponse(BaseModel):
    """Response schema for crop recommendation"""
    success: bool
    crop: str
    crop_id: int
    confidence: Optional[str] = "Model provides categorical prediction"
    message: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "crop": "Rice",
                "crop_id": 11,
                "confidence": "Model provides categorical prediction",
                "message": "Based on the provided soil and climate conditions, Rice is recommended."
            }
        }

class FertilizerPredictionResponse(BaseModel):
    """Response schema for fertilizer recommendation"""
    success: bool
    fertilizer: str
    fertilizer_id: int
    explanation: str
    message: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "fertilizer": "Urea",
                "fertilizer_id": 0,
                "explanation": "Urea is recommended for optimal nitrogen supply.",
                "message": "Based on your soil analysis and crop type, Urea fertilizer is recommended."
            }
        }

# Crop mapping (common crops in agriculture)
CROP_MAPPING = {
    0: "Rice", 1: "Maize", 2: "Chickpea", 3: "Kidney Beans", 4: "Pigeon Peas",
    5: "Moth Beans", 6: "Mung Bean", 7: "Black Gram", 8: "Lentil", 9: "Pomegranate",
    10: "Banana", 11: "Mango", 12: "Grapes", 13: "Watermelon", 14: "Muskmelon",
    15: "Apple", 16: "Orange", 17: "Papaya", 18: "Coconut", 19: "Cotton",
    20: "Jute", 21: "Coffee"
}

# Fertilizer mapping
FERTILIZER_MAPPING = {
    0: "Urea", 1: "DAP", 2: "14-35-14", 3: "28-28", 4: "17-17-17",
    5: "20-20", 6: "10-26-26"
}

# Fertilizer explanations
FERTILIZER_EXPLANATIONS = {
    "Urea": "High nitrogen content fertilizer, ideal for leafy growth and green crops.",
    "DAP": "Diammonium Phosphate - provides nitrogen and phosphorus for root development.",
    "14-35-14": "Balanced NPK fertilizer with high phosphorus for flowering and fruiting.",
    "28-28": "Equal nitrogen and phosphorus for balanced crop growth.",
    "17-17-17": "All-purpose balanced NPK fertilizer for general use.",
    "20-20": "Nitrogen and phosphorus balanced fertilizer for steady growth.",
    "10-26-26": "Low nitrogen, high phosphorus and potassium for fruit and flower production."
}
