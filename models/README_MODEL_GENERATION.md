# Model Generation Guide

## Missing Model File?

If you're getting errors about missing `plant-disease-model.pth`, you need to generate it by running the training notebook.

## Steps to Generate the Plant Disease Model

### 1. Download the Dataset

The notebook requires the PlantVillage dataset. Download it from:
- **Kaggle**: [PlantVillage Dataset](https://www.kaggle.com/datasets/arjuntejaswi/plant-village)
- Or search for "PlantVillage dataset" on Kaggle

Extract the dataset to a folder accessible by your Jupyter environment.

### 2. Run the Training Notebook

```bash
# Navigate to notebooks directory
cd notebooks

# Launch Jupyter
jupyter notebook plant-disease-classification-resnet.ipynb
```

### 3. Update Dataset Path

In the notebook, update the `data_dir` variable to point to your downloaded dataset location:

```python
# Example:
data_dir = '../path/to/PlantVillage'
```

### 4. Run All Cells

- Run all cells in the notebook sequentially
- Training takes approximately:
  - **54 minutes on CPU** (10% dataset subset)
  - **~9 hours on CPU** (full dataset)
  - **Much faster on GPU** if available

### 5. Verify Model File

After training completes, verify the model file exists:

```bash
ls ../models/plant-disease-model.pth
```

The file should be around 44-45 MB in size.

## Quick Start (For Testing)

If you just want to test the backend without training:

1. The backend will show a clear error message when the model is missing
2. You can still test other features (crop recommendation, fertilizer prediction)
3. For disease detection to work, you MUST generate the model file

## Model Architecture

- **Type**: ResNet18 (pretrained, fine-tuned)
- **Classes**: 38 plant disease categories
- **Input**: 224x224 RGB images
- **Output**: Disease classification with confidence scores

## Troubleshooting

### "Model file not found" error
- Run the training notebook as described above
- Ensure the model is saved to `models/plant-disease-model.pth`

### Out of memory during training
- Reduce batch size in the notebook
- Use the 10% subset option
- Close other applications
- Consider using Google Colab with GPU

### Different model path
- If you trained the model elsewhere, copy `plant-disease-model.pth` to this `models/` folder
- The backend expects it at: `models/plant-disease-model.pth`

## Cloud Storage Alternative

For teams, consider storing the trained model in cloud storage:
- Google Drive
- Dropbox
- AWS S3
- Azure Blob Storage

Then download it before starting the backend.
