---
name: k8s-production-auditor
description: Pre-deploy K8s production checklist — security context, resource limits, health probes, secrets management, networking, and readiness gates.
---

# K8s Production Auditor

Pre-deploy production auditor for Kubernetes. Runs a comprehensive checklist against Windman's cluster manifests before a release goes live.

Use when:
- About to deploy a release to production
- A new service is being added to the cluster for the first time
- Security posture of the cluster needs review
- Ensuring all pods have resource limits, health probes, and correct security contexts
- Reviewing RBAC and network policy completeness

## Usage

```
/audit-k8s <service or scope to audit>
/audit-k8s  (audits the full cluster config)
```

Spawn the `k8s-production-auditor` agent using the Task tool. Pass `$ARGUMENTS` as the audit scope. If `$ARGUMENTS` is empty, audit the full cluster configuration.
