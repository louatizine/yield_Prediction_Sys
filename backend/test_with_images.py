"""
Test with actual image transformation pipeline to see if that's the issue
"""
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent))

from services.disease_detection import disease_service, PLANT_DISEASES

# Load model
print("Loading model...")
success = disease_service.load_model()
print(f"Model loaded: {success}\n")

# Create several different test images with different patterns
print("Testing with different synthetic images:")
print("=" * 80)

for test_num in range(5):
    # Create different types of synthetic images
    if test_num == 0:
        # Random noise
        img_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
    elif test_num == 1:
        # All black
        img_array = np.zeros((224, 224, 3), dtype=np.uint8)
    elif test_num == 2:
        # All white
        img_array = np.ones((224, 224, 3), dtype=np.uint8) * 255
    elif test_num == 3:
        # Red image
        img_array = np.zeros((224, 224, 3), dtype=np.uint8)
        img_array[:,:,0] = 255
    else:
        # Green image (like leaves)
        img_array = np.zeros((224, 224, 3), dtype=np.uint8)
        img_array[:,:,1] = 255
    
    # Convert to PIL Image
    img = Image.fromarray(img_array)
    
    # Apply the same transformations as in the service
    img_tensor = disease_service.transform(img).unsqueeze(0).to(disease_service.device)
    
    # Make prediction
    with torch.no_grad():
        outputs = disease_service.model(img_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)
    
    predicted_class = PLANT_DISEASES[predicted.item()]
    confidence_score = confidence.item()
    
    print(f"\nTest {test_num + 1} - {'Random'if test_num ==0 else 'Black' if test_num == 1 else 'White' if test_num == 2 else 'Red' if test_num == 3 else 'Green'} image:")
    print(f"  Predicted: {predicted_class}")
    print(f"  Confidence: {confidence_score:.4f}")
    print(f"  Class index: {predicted.item()}")
    
    # Show top 3 predictions
    top_probs, top_indices = torch.topk(probabilities[0], 3)
    print(f"  Top 3:")
    for prob, idx in zip(top_probs, top_indices):
        print(f"    {idx.item()}: {PLANT_DISEASES[idx.item()]} ({prob.item():.4f})")

print("\n" + "=" * 80)
print("\nCONCLUSION:")
print("If all predictions are the same class with high confidence,")
print("the model needs to be retrained from the notebook.")
