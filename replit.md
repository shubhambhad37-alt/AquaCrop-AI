# AquaCrop AI

A model-driven agricultural water-intelligence workspace for estimating, explaining, comparing, and simulating crop water footprints.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/aquacrop-ai run dev` — run the AquaCrop AI web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Optional env: `AQUACROP_LOW_THRESHOLD`, `AQUACROP_MEDIUM_THRESHOLD` — configurable educational category thresholds

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/lib/aquacrop.ts` — deterministic demo dataset, preprocessing, model training, evaluation, prediction, and explanation logic
- `artifacts/api-server/src/routes/aqua.ts` — AquaCrop API routes and in-memory prediction history
- `artifacts/aquacrop-ai/src/pages/` — dashboard, prediction, comparison, simulator, recommendation, performance, history, and methodology screens
- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `docs/` — academic documentation and viva preparation
- `README.md` — setup, architecture, methodology, and limitations

## Architecture decisions

- The demo dataset is generated deterministically at API startup so displayed KPIs and predictions are reproducible and never silently presented as real measurements.
- Model selection is based on held-out RMSE across Linear Regression, Decision Tree, and Random Forest candidates; the selected model drives both predictions and feature importance.
- The workspace keeps the existing Express service and generated OpenAPI client as the runtime boundary, with a TypeScript-compatible in-process ML implementation so Replit can run the demo without a separate Python runtime.
- Blue/green/grey water is explicitly marked unsupported until the data contains enough field and pollution information to calculate the components defensibly.

## Product

Users can inspect actual dataset/model KPIs, submit growing conditions for an explained L/kg estimate, compare crop footprint ranges, run model-based what-if scenarios, rank crops by predicted water efficiency, review performance metrics, and save/clear prediction history.

## User preferences

_No persistent user preferences recorded._

## Gotchas

- The demo data is synthetic; do not describe its values as authoritative agricultural measurements.
- The API service must be restarted after backend model or route changes because its workflow runs a built bundle.
- API units are L/kg throughout the product. The UI and documentation intentionally avoid m³/t.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
