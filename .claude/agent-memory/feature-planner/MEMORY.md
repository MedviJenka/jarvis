# Feature Planner Agent Memory

## Vector Store Decision (April 2026)
- **Decision: Qdrant Cloud** over self-hosted Qdrant or pgvector
- Rationale: Zero ops, identical SDK (`qdrant_client`), migration is env-var-only change
- Free tier: 1 GB, sufficient for ~50 PDFs across all users
- K8s `vectors.yaml` uses `emptyDir: {}` -- data loss on pod restart (critical bug)
- Migration: change `QDRANT_URL` + `QDRANT_API_KEY` in env, no code changes

## RAG POH Known Bugs (April 2026)
- `_document_exists()` checks `source` field never set during ingestion -- always re-ingests
- `flow.py:on_not_secure()` does bare `raise` -- crashes with TypeError
- `/chat` endpoint is sync (blocks event loop), should use `kickoff_async`
- `RagTool()` from crewai_tools is redundant alongside custom `QdrantRAGTool`
- No per-user rate limit on `/chat` (only slowapi IP-based)
- Upload `finally` block logs to DB even on failure

## Port Assignments
- 5001: forecast, 5002: logbook, 5003: database, 5004: certifications
- 5005: rag, 5006: stt, 5008: users, 5009: notam, 5010: navigation
- 6333: qdrant/vectors, 9999: payment

## Data Scale Reference
- Typical POH: 200-400 pages, ~100-200 chunks at 800 words
- ~16 KB per vector point (12 KB vector + 4 KB payload)
- ~1.6-3.2 MB per POH in Qdrant
- Qdrant Cloud free tier (1 GB) covers ~300+ POHs

## Recurring UX Patterns
- Pilots need offline-first flows (weather/NOTAM data should cache)
- POH queries are time-sensitive (preflight) -- latency matters
- Error messages must be clear and actionable (not generic 500s)
- Color-coded severity is standard for NOTAM/weather (already implemented)

## Architecture Conventions
- Services template: FastAPI + `/health` + `/` -> `/docs` redirect
- Auth: `Depends(get_current_user)` on all protected routes
- Rate limit: check usage -> try kickoff -> finally increment
- AI: Flow layer calls Crew, service calls Flow (never Crew directly)
- DB clients inherit `DatabaseClient`, use schema dataclasses
- Frontend: `authFetch`, `SafeAreaLayoutWrapper`, bg `#071325`
- Logging: `Logfire(name='...')` in every module
- Env loaded from `k8s/base/.env` (not `backend/.env`)
