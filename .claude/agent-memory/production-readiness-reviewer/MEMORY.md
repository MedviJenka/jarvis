# Production Readiness Reviewer Memory

## Known Gaps by Area

### Kubernetes / k8s/schemas/ — audited 2026-04-10
- NO resource requests/limits on ANY workload — critical OOMKill risk for all services
- NO securityContext on any container or pod spec
- Qdrant vectors.yaml uses emptyDir — vector data is ephemeral, lost on pod restart (CRITICAL)
- RAG rag.yaml uses emptyDir for /app/storage AND has 3 replicas — file uploads not shared, lost on restart
- Ingress has ssl-redirect:"true" annotation but NO tls: section in spec — nginx will redirect to HTTPS that has no cert
- Ingress exposes vectors.windman.local (Qdrant) at port 6333 — internal DB accessible externally (CRITICAL)
- No failureThreshold/timeoutSeconds on any probe — defaults too tight for slow AI endpoints
- No Namespace manifests — namespace must be pre-created; dev/prod overlays set namespace but base has none
- No PodDisruptionBudget, NetworkPolicy, or HPA defined
- qdrant/qdrant:latest tag — unpinned; data loss risk on restart with emptyDir
- APP_ENV never set in k8s manifests or overlays — CORS will be wildcard in prod (CRITICAL)
- LOGFIRE_TOKEN never set in any compose or k8s manifest — no observability in production
- No prod overlay beyond namespace — effectively using base/dev config in prod
- deploy.k8s.sh hardcodes OVERLAY_PATH=k8s/overlays/dev (wrong path — actual path is k8s/deployments/dev)

### Application Layer — audited 2026-04-10
- CRITICAL: certifications/api.py lines 90,194 — display_certification/display_licenses accept user_id as URL query param, not from JWT. IDOR: any authenticated user can read any other user's certifications/licenses.
- CRITICAL: database/api.py lines 28,42 — upload and get_storage_url accept user_id as raw query param — IDOR
- CRITICAL: rag/flow.py line 39 — on_not_secure does bare `raise` with no active exception — RuntimeError crash
- CRITICAL: stt/api.py line 21 — router has NO dependencies=[Depends(get_current_user)] — STT endpoint unauthenticated; user_id taken as raw query param
- HIGH: notam/api.py line 62 — increment_daily_request() in finally block — charges user even on AI failure
- HIGH: forecast/api.py line 106 — detail=str(e) leaks internal exception to client
- HIGH: logbook/api.py — detail contains str(e) across all 500 responses
- HIGH: certifications/api.py — detail contains str(e) across all 500 responses
- HIGH: rag/api.py line 75 — HTTP 418 I'm a Teapot on upload failure — should be 500
- HIGH: certifications/api.py line 151 — upload_license has NO auth dependency, user_id never extracted from JWT
- HIGH: forecast/client.py — no timeout on requests.get calls — can hang indefinitely
- HIGH: all blocking requests.get calls inside async endpoint handlers — blocks event loop
- HIGH: Stripe has NO webhook endpoint — payment lifecycle events (cancellation, failed payment) unhandled
- MEDIUM: Logfire.fire is @property calling logfire.configure() on every log call — should configure once
- MEDIUM: CrewAI verbose=True in notam, rag, vision crews — stdout noise in prod
- MEDIUM: RAG agent has allow_delegation: true — unexpected agent delegation loops possible
- MEDIUM: rag/api.py ask() is sync def inside async router — blocks with CrewAI kickoff()
- MEDIUM: settings.py uses os.getenv() directly — no startup failure on missing required keys
- LOW: payment_service.py logger name is 'forecast-service' (copy-paste)
- LOW: deploy.k8s.sh OVERLAY_PATH defaults to k8s/overlays/dev — wrong path

### Verified Good Patterns
- All major routers have dependencies=[Depends(get_current_user)] at router level (except STT)
- JWT validation uses PyJWKClient with ES256 — correct for Supabase
- UserDatabaseClient.increment_daily_request reads current count before writing — no stale counter
- forecast/api.py rate limit returns HTTP 429 correctly
- Qdrant multitenancy enforced via user_id payload filter
- uv sync --no-dev used in Dockerfile builder stage
- All compose services have restart: unless-stopped and healthcheck blocks
- .env and cached.env in .gitignore; k8s secrets.env gitignored
- notam and forecast agents have max_iter set (5 and 1 respectively)

### Missing Config/Env Fields
- LOGFIRE_TOKEN: uses os.getenv directly in logger.py, not in Config
- STRIPE_WEBHOOK_SECRET: not defined in Config, no webhook handler
- SUPABASE_JWT_SECRET: referenced in legacy core/api/v1/security/auth.py but not in Config
- NOTAMIFY_API_KEY: in CLAUDE.md but not found in codebase/settings — likely stale doc

Notes:
- Always use absolute file paths.
- Avoid emojis in responses.
- Do not use a colon before tool calls.
