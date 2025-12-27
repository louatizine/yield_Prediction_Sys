import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

# Plant disease classes (38 classes)
PLANT_DISEASES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 
    'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 
    'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 
    'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
    'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy', 
    'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 
    'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 
    'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

class ResNet18Model(nn.Module):
    def __init__(self, num_classes=38):
        super(ResNet18Model, self).__init__()
        self.network = models.resnet18(pretrained=False)
        num_ftrs = self.network.fc.in_features
        self.network.fc = nn.Linear(num_ftrs, num_classes)
    
    def forward(self, xb):
        return self.network(xb)

class DiseaseDetectionService:
    """Service for loading and using the pre-trained ResNet18 disease detection model"""
    
    def __init__(self):
        self.model = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model_path = Path(__file__).parent.parent.parent / "models" / "plant-disease-model.pth"
        self.classes = PLANT_DISEASES
        
        # Image transformations (same as training)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
    def load_model(self):
        """Load the ResNet18 model at application startup"""
        try:
            self.model = ResNet18Model(num_classes=38)
            self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
            self.model.to(self.device)
            self.model.eval()
            logger.info(f"✓ Plant disease model loaded successfully from {self.model_path}")
            return True
        except Exception as e:
            logger.error(f"✗ Failed to load plant disease model: {str(e)}")
            raise
    
    def predict_disease(self, image_bytes: bytes) -> dict:
        """
        Predict plant disease from image bytes
        
        Args:
            image_bytes: Image file bytes
        
        Returns:
            dict: Prediction results with disease name, confidence, and plant info
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        try:
            # Load and preprocess image
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Make prediction
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                confidence, predicted = torch.max(probabilities, 1)
                
            # Get prediction details
            predicted_class = self.classes[predicted.item()]
            confidence_score = confidence.item()
            
            # Parse disease information
            parts = predicted_class.split('___')
            plant_name = parts[0].replace('_', ' ')
            disease_name = parts[1].replace('_', ' ') if len(parts) > 1 else 'Unknown'
            
            # Get top 3 predictions
            top_probs, top_indices = torch.topk(probabilities[0], 3)
            top_predictions = [
                {
                    'disease': self.classes[idx.item()].split('___')[1].replace('_', ' '),
                    'plant': self.classes[idx.item()].split('___')[0].replace('_', ' '),
                    'confidence': float(prob.item())
                }
                for prob, idx in zip(top_probs, top_indices)
            ]
            
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
