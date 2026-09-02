# 🌱 AquaCrop AI

AI-ML Based Agricultural Water Footprint Prediction & Sustainable Crop Recommendation System

## 🚀 Live Demo

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-AquaCrop_AI-success?style=for-the-badge)](https://aqua-crop-ai--shubhambhad37.replit.app/)

## 📂 Source Code

This repository contains the source code for the AquaCrop AI project.
# AquaCrop AI

## Abstract

AquaCrop AI is an academic AI/ML mini-project that estimates agricultural water footprints in litres per kilogram, explains the strongest model signals, compares crops, simulates changes in farm practice, and ranks water-efficient alternatives under comparable conditions.

The project demonstrates the complete workflow:

```text
data → preprocessing → training → evaluation → prediction → explanation → recommendation
```

## Problem Statement

Agricultural water use varies with crop, weather, irrigation, soil, growing duration, farm scale, yield, and region. A farmer or student needs an accessible way to explore how those variables relate to water footprint without confusing a model estimate with a direct field measurement.

## Objectives

- Build a reproducible supervised regression workflow.
- Compare Linear Regression, Decision Tree, and Random Forest models.
- Expose actual evaluation metrics and model-derived feature importance.
- Support prediction, what-if scenarios, crop comparison, recommendations, and history.
- Keep scientific claims honest and clearly label synthetic demonstration data.

## Features

- Dashboard KPIs calculated from the generated dataset and evaluated model.
- Prediction form with positive-input validation and model explanation.
- Crop comparison with search and sorting.
- Model-based current-vs-modified scenario simulation.
- Water-efficiency crop recommendation ranking.
- Model Performance page with MAE, RMSE, R², actual-vs-predicted points, and feature importance.
- Prediction History with clear-history action.
- About page covering methodology, limitations, and the blue/green/grey water boundary.

## Dataset and Methodology

The included 240-row demo dataset is synthetic and generated deterministically from documented assumptions. It includes Indian crop and state names, temperature, rainfall, cultivated area, production quantity, irrigation water, irrigation type, soil type, growing duration, and a generated water-footprint target.

> The included demo dataset is synthetic and is intended only to demonstrate the machine-learning workflow. It must not be interpreted as authoritative agricultural water-footprint measurements.

The API generates the dataset at startup, preprocesses numeric and categorical inputs into a consistent feature vector, reserves every fifth row for a deterministic test set, trains all three models on the remaining 80%, evaluates the candidates, and selects the lowest-test-RMSE model. No dashboard metric or prediction is hardcoded.

Blue, green, and grey water are **not** calculated because the demo data does not contain sufficient field-level information about water sources, effective evapotranspiration, or pollution dilution. The interface states this limitation wherever the breakdown could otherwise be misunderstood.

Water-use categories are configurable with `AQUACROP_LOW_THRESHOLD` and `AQUACROP_MEDIUM_THRESHOLD`. Defaults are 550 and 1100 L/kg for this educational demonstration; they are not universal scientific thresholds.

## System Architecture

```text
React + Vite
      │
      ▼
REST API at /api
      │
      ▼
Express service
      │
      ├── deterministic dataset generator
      ├── preprocessing + model training
      ├── evaluation + explainability
      └── prediction history
```

The runtime-compatible model implementations are kept in `artifacts/api-server/src/lib/aquacrop.ts`. The same feature contract is exposed through the OpenAPI file at `lib/api-spec/openapi.yaml`, which generates typed React Query hooks and Zod validators.

## Technologies

- React, TypeScript, Vite, Tailwind CSS, Recharts
- Express 5 REST API
- Zod validation and OpenAPI/Orval code generation
- Deterministic synthetic data and in-process regression implementations
- pnpm workspace monorepo

## Installation and Running

Install dependencies:

```bash
pnpm install
```

Start the backend:

```bash
pnpm --filter @workspace/api-server run dev
```

Start the frontend in another terminal:

```bash
pnpm --filter @workspace/aquacrop-ai run dev
```

The Replit workflows start both services with the correct ports and proxy routing. The frontend calls `/api/...`; do not hardcode localhost into the browser code.

Useful checks:

```bash
pnpm run typecheck
pnpm --filter @workspace/api-spec run codegen
```

## API Documentation

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/healthz` | Service health |
| GET | `/api/crops` | Dataset crop summaries |
| GET | `/api/states` | Dataset states |
| GET | `/api/dashboard` | Dataset and model KPIs |
| GET | `/api/model-performance` | Actual model metrics and validation points |
| GET | `/api/feature-importance` | Model-derived explanatory features |
| GET | `/api/crop-footprints` | Observed crop footprint summaries |
| POST | `/api/predict` | Estimate and explain one input |
| POST | `/api/simulate` | Compare two model-based scenarios |
| POST | `/api/recommend` | Rank crops under supplied conditions |
| GET | `/api/history` | Read recent prediction history |
| POST | `/api/history` | Save a prediction |
| DELETE | `/api/history` | Clear history |

## Project Structure

```text
artifacts/
  api-server/
    src/lib/aquacrop.ts       # dataset, preprocessing, training, evaluation
    src/routes/aqua.ts         # prediction, analytics, history API
  aquacrop-ai/
    src/App.tsx               # frontend route shell
    src/pages/                # dashboard and product surfaces
    src/components/           # shared field and shell components
lib/
  api-spec/openapi.yaml       # API source of truth
  api-client-react/           # generated React Query client
  api-zod/                    # generated server validators
docs/
  project_documentation.md
  methodology.md
  ml_explanation.md
  viva_questions.md
```

## Limitations and Future Scope

This is an educational demonstration, not an agronomic decision system. The data is synthetic, field uncertainty is not represented, and the prediction target is a generated proxy. Future work could replace the generator with a cited measured dataset, add cross-validation and uncertainty intervals, calculate blue/green/grey components from a defensible water-footprint methodology, and incorporate soil suitability, profitability, market demand, pests, and local agronomy into recommendations.

## References

- Mekonnen, M. M. and Hoekstra, A. Y., *The green, blue and grey water footprint of crops and derived crop products*.
- Hoekstra, A. Y. et al., *The Water Footprint Assessment Manual*.
- Scikit-learn User Guide, regression model evaluation concepts.

## Screenshots

Screenshots can be added here after a local demonstration run.
