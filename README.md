# Yield Prediction Project

## Project Overview
This project aims to predict crop yields using machine learning techniques. It includes data preprocessing, model training, and a web application for recommendations. The project also explores plant disease classification using deep learning.

## Project Structure
```
Yield_Prediction/
├── app/
│   ├── backend/        # Backend code for the web application
│   ├── frontend/       # Frontend code for the web application
├── Data-processed/     # Processed datasets
├── data-row/           # Raw datasets
├── models/             # Trained machine learning models
├── notebooks/          # Jupyter notebooks for data preparation and analysis
├── requirement.txt     # Python dependencies
```

## Notebooks
- **Crop_data_prep.ipynb**: Data preparation for crop yield prediction.
- **Crop_Recommendation_Model.ipynb**: Model training for crop recommendations.
- **plant-disease-classification-resnet-99-2.ipynb**: Plant disease classification using ResNet.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Yield_Prediction
   ```
3. Install dependencies:
   ```bash
   pip install -r requirement.txt
   ```
4. Run the application:
   - Navigate to the `app/` directory and follow the instructions for the backend and frontend.

## Dependencies
The project uses the following Python libraries:
- Flask
- scikit-learn
- PyTorch
- XGBoost
- Jupyter

Refer to `requirement.txt` for the complete list.

## Contribution
Feel free to fork the repository and submit pull requests for improvements.

