# Trained Models

This directory contains trained PyTorch model files (.pth) which are **NOT** tracked in Git due to their large size.

## Available Models

### Plant Disease Classification Model
- **File**: `plant-disease-model.pth` (state_dict only)
- **File**: `plant-disease-model-complete.pth` (entire model)
- **Architecture**: ResNet18 (pretrained, modified final layer)
- **Classes**: 38 plant disease categories
- **Training**: See `notebooks/plant-disease-classification-resnet.ipynb`
- **Performance**: ~99% validation accuracy (on 10% subset)

## How to Reproduce

1. Run the notebook: `notebooks/plant-disease-classification-resnet.ipynb`
2. Training takes ~54 minutes on CPU (10% dataset) or ~9 hours (full dataset)
3. Models will be saved automatically to this directory

## Model Storage Options

Since model files are large, they're stored:
- **Locally**: In this `models/` directory (gitignored)
- **Cloud**: [Add your cloud storage link here]
- **Alternative**: Use Git LFS for files up to 2GB

## Loading a Trained Model

```python
import torch
from torchvision import models
import torch.nn as nn

# Define the model architecture
class ResNet18Model(ImageClassificationBase):
    def __init__(self, num_classes, pretrained=True):
        super().__init__()
        self.network = models.resnet18(pretrained=pretrained)
        self.network.fc = nn.Linear(self.network.fc.in_features, num_classes)
    
    def forward(self, xb):
        return self.network(xb)

# Load the saved model
device = torch.device('cpu')
model = ResNet18Model(num_classes=38)
model.load_state_dict(torch.load('models/plant-disease-model.pth', map_location=device))
model.eval()
```

## Notes

- Model files are excluded from Git via `.gitignore`
- You can retrain the model anytime using the notebook
- For collaboration, share models via cloud storage links

## Git Tracking

- Root `models/` folder is excluded from version control to avoid committing large `.pth`/`.pkl` artifacts.
- The backend source code in `backend/models/` remains tracked; only the root models directory is ignored via leading-slash rule (`/models/`).
- If you need to share models, prefer a cloud link or configure Git LFS for large files.
