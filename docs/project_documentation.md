# AquaCrop AI — Project Documentation

## 1. Introduction

AquaCrop AI applies supervised machine learning to an agricultural sustainability question: estimating the water footprint of a crop in litres per kilogram. It is designed as a college mini-project and as a short demonstration that makes the data-to-decision workflow visible.

## 2. Existing System

Traditional water-footprint work often depends on spreadsheets, static lookup tables, or detailed field studies. Those methods can be valuable, but they do not give a student a compact way to test multiple conditions, compare candidate models, and see which signals influenced a prediction.

## 3. Proposed System

The proposed system creates a documented demo dataset, transforms categorical and numeric variables into a model-ready vector, trains three regression algorithms, evaluates them on held-out rows, selects the strongest model using test RMSE, and exposes the result through an API and web interface.

## 4. User Flow

1. Open the dashboard and inspect dataset/model KPIs.
2. Enter crop and growing conditions on Predict.
3. Review the estimated L/kg value, usage category, and explanation.
4. Change irrigation or other inputs in What-If Simulator.
5. Compare crop averages from the dataset.
6. Request a water-efficiency-only recommendation.
7. Review actual model metrics and saved prediction history.

## 5. Scientific Honesty

The UI distinguishes generated dataset targets, model predictions, scenario simulations, and recommendations. It does not present predictions as measurements or recommendations as a complete farming decision. The demo explicitly states that blue/green/grey components require additional field data.