# Yield Prediction System

## Project Overview
This project aims to predict the best crops for cultivation based on various environmental and soil parameters. It uses machine learning models to provide recommendations.

## Directory Structure
```
yield_Prediction_Sys/
│
├── data/
│   ├── raw/                # Raw data files
│   ├── processed/          # Processed data files
│
├── models/                 # Saved models
│
├── notebooks/              # Jupyter notebooks
│
├── src/                    # Source code
│   ├── data_processing.py  # Data processing scripts
│   ├── model_training.py   # Model training scripts
│   ├── utils.py            # Utility functions
│
├── tests/                  # Unit tests
│
├── requirement.txt         # Python dependencies
├── README.md               # Project documentation
├── .gitignore              # Git ignore file
```

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/louatizine/yield_Prediction_Sys.git
   ```

2. Navigate to the project directory:
   ```bash
   cd yield_Prediction_Sys
   ```

3. Install dependencies:
   ```bash
   pip install -r requirement.txt
   ```

4. Run Jupyter Notebook:
   ```bash
   jupyter notebook
   ```

## Usage
- Use the notebooks in the `notebooks/` directory to explore data and train models.
- Reusable scripts for data processing and model training are in the `src/` directory.

## Recent Updates
- Fixed errors in the Jupyter notebook related to missing modules and data processing.
- Added `ERRORS_AND_SOLUTIONS.md` to document encountered issues and their solutions.
- Updated the notebook to ensure compatibility with `XGBoost` and other classifiers.

## Contributing
Feel free to submit issues or pull requests to improve the project.

