# K8s Kustomize Reviewer — Agent Memory

## Project Structure
- Base manifests: `backend/k8s/schemas/`
- Dev overlay: `backend/k8s/deployments/dev/`
- Prod overlay: `backend/k8s/deployments/prod/`
- Old ingress still on disk at `k8s/schemas/ingress.yaml` — not removed after Gateway API migration

## Naming Conventions
- Deployments: `windman-<service>` (e.g. `windman-forecast`, `windman-flight-computer`)
- ImagePullSecrets name: `ghcr` (not `ghcr-secret`)
- Kustomize base namespace: not set in schemas — overlays inject `namespace: dev` or `namespace: prod`

## Service Ports (canonical)
| Service | Port |
|---|---|
| forecast | 5001 |
| logbook | 5002 |
| rag | 5005 |
| flight_plan | 5007 |
| users | 5008 |
| notam | 5009 |
| navigation | 5010 |
| flight_computer | 5011 |
| chat | 5012 |
| payment | 9999 |

## Gateway API Migration (reviewed 2026-04-28)
- Replaced ingress-nginx with Traefik Gateway API (gateway.networking.k8s.io/v1)
- Gateway: `windman-gateway`, namespace `dev`, HTTP/80
- HTTPRoute: `windman-route`, 11 PathPrefix rules
- Three nginx annotations NOT yet translated: proxy-body-size (50m), CORS, proxy-connect-timeout (60s)
- `allowedRoutes.namespaces.from: Same` locks HTTPRoute to Gateway's namespace — correct for single-namespace setup but breaks if Gateway moves to infra namespace
- navigation.yaml exists on disk and is referenced in route.yaml but missing from kustomization.yaml resources list
- NetworkPolicy still references `ingress-nginx` namespace label — must be updated to Traefik's namespace
- cert-issuer.yaml still references `ingressClassName: nginx` — must be updated for Traefik Gateway API ACME solver
- Old ingress.yaml left in schemas directory but removed from kustomization.yaml — safe (not applied), but confusing

## Overlay State After Migration
- dev/kustomization.yaml still patches `kind: Ingress` — patch is now a no-op (Ingress not in resource list); will cause kustomize build error
- prod/kustomization.yaml still patches `kind: Ingress` — same issue; also contains TLS/host config that needs Gateway API equivalents
- prod overlay needs: Gateway listener for HTTPS/443 + TLS cert ref, CORS locked to `https://windman.app`, host-based routing via HTTPRoute `hostnames:` field

## Recurring Issues Found
- Wildcard CORS (`*`) in base must be overridden to origin-locked value in prod overlay
- PathPrefix ordering: `/api/v1/database/users` must appear before `/api/v1/users` in Gateway API (Gateway API spec says most specific wins by longest match — but same-length prefix ambiguity exists)
- All `replicas: 1` in prod overlay for most services — HA concern
- NetworkPolicy ingress allow rules tied to `ingress-nginx` namespace label — must change with controller switch
