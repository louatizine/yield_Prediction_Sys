# Yield Prediction System

## Project Overview
A comprehensive agricultural AI system that provides intelligent recommendations for crop cultivation, fertilizer application, and plant disease classification. The system leverages machine learning models trained on environmental, soil, and visual data to assist farmers in making data-driven decisions.

## Features
- **Crop Recommendation**: Predicts the best crops based on soil nutrients (N, P, K), temperature, humidity, pH, and rainfall
- **Fertilizer Recommendation**: Suggests optimal fertilizer types based on crop and soil conditions
- **Plant Disease Classification**: ResNet-based deep learning model for identifying plant diseases from images

## Directory Structure
```
yield_Prediction_Sys/
│
├── Data-raw/                       # Original raw datasets
│   ├── cpdata.csv                  # Crop parameters data
│   ├── Fertilizer.csv              # Fertilizer information
│   ├── FertilizerData.csv          # Fertilizer application data
│   └── MergeFileCrop.csv           # Combined crop data
│
├── Data-processed/                 # Cleaned and processed datasets
│   ├── crop_recommendation.csv     # Preprocessed crop data
│   ├── fertilizer.csv              # Processed fertilizer data
│   ├── FertilizerData.csv          # Processed fertilizer application data
│   └── MergeFileCrop.csv           # Merged crop dataset
│
├── models/                         # Trained ML models
│   ├── plant-disease-model.pth     # Plant disease classification model (ResNet)
│   └── plant-disease-model-complete.pth
│
├── notebooks/                      # Jupyter notebooks for analysis and training
│   ├── Crop_data_prep.ipynb        # Data preprocessing
│   ├── Crop_Recommendation_Model.ipynb  # Crop recommendation model training
│   ├── Final_recommendationdata_creation.ipynb  # Final data preparation
│   └── plant-disease-classification-resnet.ipynb  # Disease classification with ResNet
│
├── requirement.txt                 # Python dependencies
├── README.md                       # Project documentation
├── .gitignore                      # Git ignore file
├── PROJECT_CONTEXT.md              # Detailed project context and background
└── ERRORS_AND_SOLUTIONS.md         # Troubleshooting guide
```


## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Jupyter Notebook
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/louatizine/yield_Prediction_Sys.git
   ```

2. Navigate to the project directory:
   ```bash
   cd yield_Prediction_Sys
   ```

3. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirement.txt
   ```

5. Launch Jupyter Notebook:
   ```bash
   jupyter notebook
   ```

## Usage

### Crop Recommendation Model
1. Open `notebooks/Crop_Recommendation_Model.ipynb`
2. Run cells to train or load the crop recommendation model
3. Input soil parameters (N, P, K, temperature, humidity, pH, rainfall) to get crop predictions

### Fertilizer Recommendation
1. Use the processed fertilizer datasets in `Data-processed/`
2. Provide crop type and soil conditions for fertilizer suggestions

### Plant Disease Classification
1. Open `notebooks/plant-disease-classification-resnet.ipynb`
2. Load the trained ResNet model from `models/plant-disease-model.pth`
3. Upload plant images for disease detection and classification

## Models & Algorithms
- **Crop Recommendation**: XGBoost, Random Forest, Decision Trees, Naive Bayes
- **Plant Disease Classification**: ResNet (Residual Neural Network) for image classification
- **Data Processing**: Pandas, NumPy for data manipulation and feature engineering

## Dataset Information
- **Crop Data**: Environmental and soil parameters with crop labels
- **Fertilizer Data**: Fertilizer types and application recommendations
- **Plant Disease Images**: Training dataset for disease classification (not included due to size)

## Recent Updates
- ✅ Fixed XGBoost compatibility issues in crop recommendation notebook
- ✅ Implemented ResNet-based plant disease classification model
- ✅ Added comprehensive data preprocessing pipelines
- ✅ Created merged crop datasets for improved model training
- ✅ Updated `.gitignore` to exclude large model files and datasets
- ✅ Added documentation for errors and solutions
- ✅ Structured project for better maintainability

## Troubleshooting
Refer to `ERRORS_AND_SOLUTIONS.md` for common issues and their solutions, including:
- XGBoost import errors
- Data loading issues
- Model training problems
- Environment setup challenges

## Contributing
Contributions are welcome! Please feel free to submit issues or pull requests to improve the project.

## License
This project is open source and available for educational purposes.

## Contact
For questions or collaboration, please open an issue on GitHub.

