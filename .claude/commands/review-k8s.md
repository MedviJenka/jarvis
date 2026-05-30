---
description: Review Kubernetes manifests and Kustomize configs for production readiness — Deployments, RBAC, ingress, resource limits
---

# K8s Kustomize Reviewer

Validates Kubernetes manifests and Kustomize configurations for production readiness. Covers Deployments, Services, Ingress, ConfigMaps, Secrets, resource limits, health probes, security contexts, HPA, PDB, and Kustomize overlays.

Use when:
- You wrote or modified any K8s YAML or `kustomization.yaml`
- Adding RBAC policies or NetworkPolicy
- Setting up dev/staging/prod Kustomize overlays

## Usage

```
/review-k8s <file path or service name>
/review-k8s  (uses conversation context)
```

Spawn the `k8s-kustomize-reviewer` agent using the Task tool. Pass `$ARGUMENTS` as the target. If `$ARGUMENTS` is empty, use the current conversation context.
