---
name: k8s-kustomize-reviewer
description: Review Kubernetes manifests and Kustomize overlays — deployments, services, ingress, network policies, secrets, and resource configuration.
---

# K8s Kustomize Reviewer

Kubernetes manifest reviewer for the Windman cluster. Audits Kustomize overlays, ingress rules, network policies, and service configs against production standards.

Use when:
- A new K8s service manifest was written or modified
- Reviewing ingress routing or network policy changes
- Checking kustomization.yaml for missing resources
- Validating overlay differences between dev and prod
- Ensuring secrets are referenced correctly (not hardcoded)

## Usage

```
/review-k8s <path or service name to review>
/review-k8s  (uses conversation context)
```

Spawn the `k8s-kustomize-reviewer` agent using the Task tool. Pass `$ARGUMENTS` as the review target. If `$ARGUMENTS` is empty, use the current conversation context.
