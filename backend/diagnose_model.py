"""
Quick diagnostic script to check if the model file is corrupted or just poorly trained
"""
import torch
from pathlib import Path

model_path = Path(__file__).parent.parent / "models" / "plant-disease-model.pth"

print(f"Checking model file: {model_path}")
print(f"File exists: {model_path.exists()}")
print(f"File size: {model_path.stat().st_size / (1024*1024):.2f} MB")

# Load the state dict
state_dict = torch.load(model_path, map_location='cpu')

print(f"\nModel has {len(state_dict)} layers")
print("\nFirst few layer names:")
for i, key in enumerate(list(state_dict.keys())[:10]):
    print(f"  {key}: shape {state_dict[key].shape}")

# Check the final layer (classification layer)
fc_weight_key = 'network.fc.weight'
fc_bias_key = 'network.fc.bias'

if fc_weight_key in state_dict:
    fc_weight = state_dict[fc_weight_key]
    fc_bias = state_dict[fc_bias_key]
    
    print(f"\nFinal classification layer:")
    print(f"  Weight shape: {fc_weight.shape} (should be [38, 512])")
    print(f"  Bias shape: {fc_bias.shape} (should be [38])")
    print(f"  Weight mean: {fc_weight.mean().item():.6f}")
    print(f"  Weight std: {fc_weight.std().item():.6f}")
    print(f"  Bias mean: {fc_bias.mean().item():.6f}")
    print(f"  Bias std: {fc_bias.std().item():.6f}")
    
    # Check if biases are heavily biased towards class 1
    print(f"\n  Top 5 bias values:")
    top_biases = torch.topk(fc_bias, 5)
    for idx, (val, i) in enumerate(zip(top_biases.values, top_biases.indices)):
        print(f"    Class {i.item()}: {val.item():.4f}")
    
    print(f"\n  Bottom 5 bias values:")
    bottom_biases = torch.topk(fc_bias, 5, largest=False)
    for idx, (val, i) in enumerate(zip(bottom_biases.values, bottom_biases.indices)):
        print(f"    Class {i.item()}: {val.item():.4f}")
    
    # This is the smoking gun - check class 1 specifically
    print(f"\n  Class 1 (Apple___Black_rot) bias: {fc_bias[1].item():.4f}")
    
else:
    print(f"\nERROR: Could not find final classification layer!")
