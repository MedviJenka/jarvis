---
description: Production readiness audit — auth, secrets, error handling, logging, rate limiting, Docker, CORS, observability
---

# Production Readiness Reviewer

Full production readiness audit of backend services, API endpoints, configuration, and Docker setup. Covers auth, secrets, error handling, logging, rate limiting, CORS, and observability.

Use when:
- About to merge to main or deploy a new service
- Shipping a new API endpoint or microservice
- Asking "is this production-ready?"

## Usage

```
/prod-ready <service name or file path>
/prod-ready  (audits based on conversation context)
```

Spawn the `production-readiness-reviewer` agent using the Task tool. Pass `$ARGUMENTS` as the target. If `$ARGUMENTS` is empty, use the current conversation context to determine what to audit.
