import pickle
import numpy as np
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class MLModelService:
    """Service for loading and using the pre-trained XGBoost model"""
    
    def __init__(self):
        self.model = None
        self.model_path = Path(__file__).parent.parent.parent / "models" / "XGBoost.pkl"
        
    def load_model(self):
        """Load the XGBoost model at application startup"""
        try:
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            logger.info(f"✓ XGBoost model loaded successfully from {self.model_path}")
            return True
        except Exception as e:
            logger.error(f"✗ Failed to load XGBoost model: {str(e)}")
            raise
    
    def predict_crop(self, features: list) -> int:
        """
        Predict crop recommendation
        
        Args:
            features: List of 7 features [N, P, K, temperature, humidity, ph, rainfall]
        
        Returns:
            int: Predicted crop class index
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        # Convert to numpy array and reshape for single prediction
        X = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = self.model.predict(X)
        
        return int(prediction[0])
    
    def predict_fertilizer(self, features: list) -> int:
        """
        Predict fertilizer recommendation
        
        Args:
            features: List of features [N, P, K, temperature, humidity, ph, rainfall, crop_type]
        
        Returns:
            int: Predicted fertilizer class index
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        # Convert to numpy array and reshape for single prediction
        X = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = self.model.predict(X)
        
        return int(prediction[0])

# Global instance
ml_service = MLModelService()
