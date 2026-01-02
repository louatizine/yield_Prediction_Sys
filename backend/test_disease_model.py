import torch
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from services.disease_detection import disease_service, PLANT_DISEASES

# Load model
print("Loading model...")
success = disease_service.load_model()
print(f"Model loaded: {success}\n")

if not success:
    print("Failed to load model!")
    sys.exit(1)

# Test with 5 different random inputs to see if predictions vary
print("Testing with 5 different random images:")
print("-" * 80)

predictions = []
for i in range(5):
    # Create random image tensor (simulating different images)
    dummy_input = torch.randn(1, 3, 224, 224).to(disease_service.device)
    
    with torch.no_grad():
        outputs = disease_service.model(dummy_input)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probabilities, 1)
        
    predicted_class = PLANT_DISEASES[predicted.item()]
    confidence_score = confidence.item()
    predictions.append((predicted_class, confidence_score, predicted.item()))
    
    print(f"Test {i+1}:")
    print(f"  Predicted Class Index: {predicted.item()}")
    print(f"  Predicted Disease: {predicted_class}")
    print(f"  Confidence: {confidence_score:.4f}")
    print()

# Check if all predictions are the same
unique_predictions = set(p[2] for p in predictions)
print("-" * 80)
print(f"\nUnique predictions: {len(unique_predictions)}")
if len(unique_predictions) == 1:
    print("⚠️ WARNING: ALL PREDICTIONS ARE THE SAME!")
    print("This indicates the model might not be properly trained or there's an issue.")
    print(f"All predictions returned: {predictions[0][0]}")
else:
    print("✓ Model produces different predictions for different inputs")

# Check model weights to see if they're all the same
print("\n" + "-" * 80)
print("Checking model weights...")
first_layer_weights = disease_service.model.network.conv1.weight
print(f"First layer weight mean: {first_layer_weights.mean().item():.6f}")
print(f"First layer weight std: {first_layer_weights.std().item():.6f}")
print(f"First layer weight min: {first_layer_weights.min().item():.6f}")
print(f"First layer weight max: {first_layer_weights.max().item():.6f}")

if first_layer_weights.std().item() < 0.0001:
    print("⚠️ WARNING: Weights have very low variance - model might not be trained!")
else:
    print("✓ Weights look reasonable")
