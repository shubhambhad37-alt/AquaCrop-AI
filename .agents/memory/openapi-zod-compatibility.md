---
name: OpenAPI and Zod compatibility
description: Orval in this workspace emits zod.int for OpenAPI integer fields, but the installed Zod version exposes number validators instead.
---

When generating API validators in this workspace, prefer numeric OpenAPI fields unless integer-specific validation is essential; enforce integer semantics at the route boundary when needed.

**Why:** The current generated Zod runtime does not provide `zod.int()`, so integer schemas make code generation succeed but fail the workspace typecheck.

**How to apply:** After changing `lib/api-spec/openapi.yaml`, rerun codegen and `pnpm run typecheck:libs` before using generated schemas in routes or the frontend.