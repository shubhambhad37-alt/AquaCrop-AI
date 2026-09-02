# Methodology

## Data

The dataset contains 240 deterministic observations across ten Indian crop names and ten Indian states. Each row has:

- Crop and state
- Temperature and rainfall
- Cultivated area and production quantity
- Irrigation water, irrigation type, and soil type
- Growing duration
- Synthetic water-footprint target in L/kg

The generator uses crop-intensity priors and documented directional assumptions: irrigation generally increases footprint, rainfall and yield efficiency reduce it, duration and temperature stress add cost, and irrigation/soil categories shift the estimate. A small deterministic noise term prevents a perfectly trivial relationship.

## Preprocessing

Numeric values are scaled to stable ranges. Categories are mapped to deterministic ordinal feature values. The exact same transformation is used for generated training rows and API inputs, preventing a train/predict feature mismatch.

## Train/Test Split

Every fifth generated row is held out as test data. The remaining 80% is used for training. This split is deterministic for reproducible results.

## Models

- Linear Regression uses a regularized normal-equation fit.
- Decision Tree Regressor recursively chooses splits that reduce squared error.
- Random Forest averages 18 bootstrapped decision trees.

The app evaluates MAE, RMSE, and R² on the held-out rows. The model with the lowest RMSE is selected automatically.

## Explanation

Tree-based models report accumulated squared-error reduction at split features. Linear regression reports absolute fitted coefficient magnitude. Values are normalized into a distribution and displayed as model-derived explanatory signals, not causal effects.

## Categories

The default demonstration thresholds are:

- LOW: below 550 L/kg
- MEDIUM: 550 to below 1100 L/kg
- HIGH: 1100 L/kg and above

These thresholds can be configured with environment variables and should not be interpreted as universal scientific standards.