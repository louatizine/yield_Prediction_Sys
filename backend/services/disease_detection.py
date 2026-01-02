import tensorflow as tf
from PIL import Image
import io
from pathlib import Path
import logging
import numpy as np

logger = logging.getLogger(__name__)

# Plant disease classes (38 classes) - MUST match the alphabetical order from training
# TensorFlow's image_dataset_from_directory sorts class folders alphabetically
PLANT_DISEASES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___healthy',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___healthy',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___healthy',
    'Potato___Late_blight',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___healthy',
    'Strawberry___Leaf_scorch',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___healthy',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus'
]

class DiseaseDetectionService:
    """Service for loading and using the trained Keras disease detection model"""
    
    def __init__(self):
        self.model = None
        self.model_path = Path(__file__).parent.parent.parent / "models" / "trained_model.keras"
        self.classes = PLANT_DISEASES
        self.image_size = (128, 128)  # Model was trained with 128x128 images
        
    def load_model(self):
        """Load the Keras model at application startup"""
        try:
            if not self.model_path.exists():
                logger.warning(f"⚠ Model file not found at {self.model_path}")
                logger.warning("⚠ Please run the notebook 'notebooks/Train_plant_disease.ipynb' to generate the model file")
                logger.warning("⚠ Disease detection service will not be available")
                return False
            
            self.model = tf.keras.models.load_model(self.model_path)
            logger.info(f"✓ Plant disease model loaded successfully from {self.model_path}")
            logger.info(f"✓ Model expects input shape: {self.model.input_shape}")
            return True
        except Exception as e:
            logger.error(f"✗ Failed to load plant disease model: {str(e)}")
            logger.error(f"⚠ Please ensure the model file exists at {self.model_path}")
            return False
    
    def predict_disease(self, image_bytes: bytes) -> dict:
        """
        Predict plant disease from image bytes
        
        Args:
            image_bytes: Image file bytes
        
        Returns:
            dict: Prediction results with disease name, confidence, and plant info
        """
        if self.model is None:
            raise RuntimeError(
                "Model not loaded. The trained_model.keras file is missing. "
                "Please run 'notebooks/Train_plant_disease.ipynb' to generate it."
            )
        
        try:
            # Load and preprocess image - match Streamlit preprocessing exactly
            # TensorFlow's image_dataset_from_directory keeps values in [0, 255] range
            # So we should NOT normalize here to match the training data format
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            image = image.resize(self.image_size)
            
            # Convert to numpy array - keep values in [0, 255] range (no normalization)
            # This matches tf.keras.preprocessing.image.img_to_array behavior
            image_array = np.array(image, dtype=np.float32)
            
            # Add batch dimension
            image_array = np.expand_dims(image_array, axis=0)
            
            # Log image statistics for debugging
            logger.debug(f"Image array shape: {image_array.shape}")
            logger.debug(f"Image array mean: {image_array.mean():.4f}, std: {image_array.std():.4f}")
            
            # Make prediction
            predictions = self.model.predict(image_array, verbose=0)
            
            # Get predicted class and confidence
            predicted_idx = np.argmax(predictions[0])
            confidence_score = float(predictions[0][predicted_idx])
            
            # Log raw outputs for debugging
            logger.debug(f"Prediction probabilities - min: {predictions.min():.4f}, max: {predictions.max():.4f}")
            logger.debug(f"Predicted class: {predicted_idx}, Confidence: {confidence_score:.4f}")
                
            # Get prediction details
            predicted_class = self.classes[predicted_idx]
            
            # Warning for suspiciously high confidence (might indicate overfitting)
            if confidence_score > 0.99:
                logger.warning(f"Very high confidence ({confidence_score:.4f}) - model might be overfitted")
            
            # Parse disease information
            parts = predicted_class.split('___')
            plant_name = parts[0].replace('_', ' ')
            disease_name = parts[1].replace('_', ' ') if len(parts) > 1 else 'Unknown'
            
            # Get top 5 predictions for better visibility
            top_indices = np.argsort(predictions[0])[::-1][:min(5, len(self.classes))]
            top_predictions = [
                {
                    'disease': self.classes[idx].split('___')[1].replace('_', ' '),
                    'plant': self.classes[idx].split('___')[0].replace('_', ' '),
                    'confidence': float(predictions[0][idx])
                }
                for idx in top_indices
            ]
            
            # Log top predictions for debugging
            logger.info(f"Prediction: {plant_name} - {disease_name} ({confidence_score:.2%})")
            logger.debug(f"Top 3 alternatives: {[(p['disease'], f"{p['confidence']:.2%}") for p in top_predictions[1:4]]}")
            
            return {
                'success': True,
                'plant': plant_name,
                'disease': disease_name,
                'confidence': float(confidence_score),
                'is_healthy': 'healthy' in disease_name.lower(),
                'top_predictions': top_predictions
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise

# Global instance
disease_service = DiseaseDetectionService()
