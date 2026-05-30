---
description: Pre-deploy K8s production audit — resource limits, health probes, security contexts, HPA, PDB, Kustomize overlays
---

# K8s Production Auditor

Comprehensive production readiness audit for Kubernetes manifests and Kustomize configurations before deployment. Checks resource limits, liveness/readiness probes, security contexts, HPA, PDB, ingress, and overlay correctness.

Use when:
- About to deploy to staging or production
- A new service was added to K8s
- Running a pre-deploy checklist

## Usage

```
/audit-k8s <service name or manifest path>
/audit-k8s  (audits based on conversation context)
```

Spawn the `k8s-production-auditor` agent using the Task tool. Pass `$ARGUMENTS` as the target. If `$ARGUMENTS` is empty, use the current conversation context.
