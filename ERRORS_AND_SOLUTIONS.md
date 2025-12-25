# Errors and Solutions

This document tracks the errors encountered during the development of the Yield Prediction System and their respective solutions.

## Error Log

### Error 1: Missing Python Modules
- **Description**: Modules like `matplotlib`, `seaborn`, `scikit-learn`, and `xgboost` were missing.
- **Solution**: Installed the required packages using `pip install`.

### Error 2: Data Processing Issue
- **Description**: Correlation computation failed due to non-numeric columns in the DataFrame.
- **Solution**: Filtered numeric columns using `df.select_dtypes(include=['number'])`.

### Error 3: ValueError in Classification
- **Description**: Target labels were strings, but classifiers expected numeric values.
- **Solution**: Used `LabelEncoder` to encode string labels into numeric values.

### Error 4: Unused Import
- **Description**: The `tree` module from `sklearn` was imported but not used.
- **Solution**: Removed the unused import.

### Error 5: Incorrect Target Labels in Train-Test Split
- **Description**: The original string labels were used instead of encoded numeric labels.
- **Solution**: Updated `Ytrain` and `Ytest` to use the encoded `labels` variable.

### Error 6: Torch Not Compiled with CUDA Enabled
- **Description**: The error `AssertionError: Torch not compiled with CUDA enabled` occurred when attempting to use `.cuda()` on the model.
- **Solution**: Updated the code to use the CPU instead of CUDA by explicitly setting the device to `torch.device("cpu")` and moving the model to the CPU using `.to(device)`. This ensures compatibility even without CUDA support.
