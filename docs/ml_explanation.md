# Machine-Learning Explanation

## Why Regression?

Water footprint is a continuous target measured in litres per kilogram, so regression is the appropriate supervised-learning framing. Classification would discard useful differences between two nearby footprint values.

## Why Compare Multiple Models?

Linear Regression provides a transparent baseline. A Decision Tree can express non-linear thresholds. Random Forest combines many trees to reduce the instability of one tree. Comparing them makes the selection measurable instead of assuming one algorithm is always best.

## Metrics

- **MAE**: average absolute prediction error in L/kg.
- **RMSE**: square-root average squared error; larger errors receive more weight.
- **R²**: proportion of target variance explained relative to a mean baseline.

The dashboard reads these values from the trained runtime model. It never embeds example accuracy values.

## Feature Importance

Feature importance indicates how much the fitted model relied on each transformed input while reducing prediction error. It is not proof that one feature causes water use to change. The app uses plain-language explanations to keep that distinction clear.

## Leakage Avoidance

The test rows are reserved before model selection and are never used to fit model parameters. The prediction endpoint only applies the preprocessing and fitted model; it does not recompute a target from the submitted values.