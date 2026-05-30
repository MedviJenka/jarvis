---
name: production-readiness-reviewer
description: Pre-deploy production audit — error handling, observability, security, rate limiting, graceful shutdown, and operational completeness.
---

# Production Readiness Reviewer

Pre-deploy auditor that checks Windman backend services against a production readiness checklist. Catches gaps in error handling, logging, auth, rate limiting, and operational setup before code ships.

Use when:
- A new service or major feature is about to be deployed
- Wanting a holistic pre-ship review beyond code correctness
- Checking Logfire instrumentation, error responses, and health endpoints
- Verifying graceful shutdown and lifespan handlers are set up
- Confirming all secrets come from env vars and not hardcoded strings

## Usage

```
/prod-ready <service or scope to audit>
/prod-ready  (uses conversation context / current branch)
```

Spawn the `production-readiness-reviewer` agent using the Task tool. Pass `$ARGUMENTS` as the audit scope. If `$ARGUMENTS` is empty, use the current conversation context.
