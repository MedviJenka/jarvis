# K8s Production Auditor — Persistent Memory

## Windman Health Endpoint Convention
Every service registers its health endpoint at `/api/v1/<service>/health`, NOT `/health`.
- chat:     `/api/v1/chat/health`              (port 5012)
- forecast: `/api/v1/forecast/health`          (port 5001)
- logbook:  `/api/v1/logbook/health`           (port 5002)
- rag:      `/api/v1/rag/health`               (port 5005)
- users:    `/api/v1/database/users/health`    (port 5008)  ← NOTE: `database/users` prefix
- notam:    `/api/v1/notam/health`             (port 5009)
- payment:  `/api/v1/payment/health`           (port 9999)
- navigation: `/api/v1/navigation/health`      (port 5010)
- flight_computer: `/api/v1/flight_computer/health` (port 5011)
- flight_plan: `/api/v1/flight_plan/health`    (port 5007)
- nginx:    `/healthz`                         (port 80)  ← nginx built-in stub

K8s probes MUST use these full paths. `/health` will always 404.

## Image Pull Secret Name
Two secret names are in use — confirm with deploy script before applying:
- `k8s/schemas/` (production path) and `bridge/` manifests: `ghcr` (per task specification)
- Earlier EC2 deploy script created it as `ghcr-secret` — that caused ImagePullBackOff
  when manifests used `ghcr`. Align whichever name the target cluster uses.
The `bridge/` overlays were fixed to use `name: ghcr`.

## Kustomize Directory Layout
- Base/schemas: `backend/k8s/schemas/`
- Dev overlay:  `backend/k8s/deployments/dev/`
- Prod overlay: `backend/k8s/deployments/prod/`
- Deploy script default: `OVERLAY_PATH=k8s/deployments/dev`
- Old wrong path `k8s/overlays/dev` must never be used.

## Ingress Routing
Each service owns a unique `/api/v1/<service>` path prefix. Never use `/` as a catch-all
for multiple services — only the first match wins in nginx ingress.
Logbook is port 5002; navigation is port 5010 (previously ingress wired logbook to 5010).

## Namespace in Base Ingress
Do NOT hardcode `namespace:` in `k8s/schemas/ingress.yaml`. Kustomize overlays inject
the namespace. Hardcoding `namespace: dev` in the base caused the resource to be
immutable across overlays.

## AI Service Startup Probes
Services rag, notam, and forecast load CrewAI/LLM clients on startup and need a
`startupProbe` with `failureThreshold: 30, periodSeconds: 10` (= 5 minutes headroom)
before liveness kicks in. Without this, liveness fires before the app is ready on EC2
cold starts and kills the pod in a restart loop.

## Resource Baseline (initial — tune after profiling)
- Light services (logbook, users, payment, navigation): 100m/256Mi req, 500m/512Mi limit
- AI services (forecast, notam): 100m/256Mi req, 500m/512Mi limit
- RAG service: 200m/512Mi req, 1000m/1Gi limit (Qdrant client + embeddings)

## Navigation Service Typo (fixed)
`navigation_service.py` had `/api/v1/lognook/health` (typo). Corrected to
`/api/v1/navigation/health`. Do not reintroduce this typo.

## Deploy Script
`deploy.k8s.sh` previously hard-required `docker-desktop` context, which broke EC2.
Fixed to `check_kubectl_context()` — validates nodes are Ready without forcing context.
Secret name aligned to `ghcr-secret`.

## Kustomize Labels Strategy
Base `kustomization.yaml` uses `includeSelectors: false` to avoid polluting matchLabels
(which are immutable after first apply). Only `includeTemplates: true` so pod template
labels get the managed-by/env labels. Overlay kustomizations add `env: dev|prod`.

## Bridge Directory (docker compose convert output)
`backend/bridge/` is a Kustomize tree generated from `docker compose convert` and then
corrected. Key fixes applied in 2026-05-07 session:
1. `restartPolicy: unless-stopped` → remove (invalid in Deployments)
2. `strategy.type: Recreate` → RollingUpdate (maxSurge:1, maxUnavailable:0)
3. `com.docker.compose.*` labels → `app: windman`, `component: <shortname>`
4. Hardcoded env vars (API keys, secrets) → `envFrom: - secretRef: name: env`
5. `image: test-<name>` → `ghcr.io/medvijenka/windman_main/<name>:latest`
6. `imagePullPolicy: IfNotPresent` → `Always` (except nginx:alpine)
7. Added `imagePullSecrets: - name: ghcr` to all GHCR service pods
8. `exec` probe with curl string → `httpGet` probes with named port `http`
9. Windows `hostPath` for nginx.conf → ConfigMap volume (`nginx-config`)
10. `namespace: test` → `namespace: windman` everywhere
11. Network policy rewritten from Compose labels to per-component K8s NetworkPolicies
12. Deployment files made multi-doc (Deployment + Service in one file)
13. `namespace: windman` added to `base/kustomization.yaml`

## Nginx ConfigMap Dependency
`bridge/base/nginx_service-deployment.yaml` mounts a ConfigMap named `nginx-config`
at `/etc/nginx/nginx.conf` via subPath. This ConfigMap must be created from
`ops/nginx/nginx.conf` before applying. Example:
  kubectl create configmap nginx-config --from-file=nginx.conf=ops/nginx/nginx.conf -n windman

## See Also
- `patterns.md` (TODO: create when more patterns emerge)
