---
name: api-architect
description: Design, review, or extend FastAPI microservice architecture — new services, endpoints, auth wiring, rate limiting, dependency injection, service-to-service comms.
---

# API Architect

Expert agent for designing and reviewing the Windman FastAPI backend architecture. Knows the service template, port registry, auth pattern, rate-limit pattern, and CrewAI integration cold.

Use when:
- Adding a new microservice
- Reviewing route organization or auth/rate-limit wiring
- Designing a `Depends`-backed DB client factory
- Evaluating service-to-service communication patterns
- Assigning ports or updating Docker/K8s infra for a new service

## Usage

```
/api-arch <describe what you need to design or review>
/api-arch  (uses conversation context)
```

Spawn the `api-architect` agent using the Task tool. Pass `$ARGUMENTS` as the task. If `$ARGUMENTS` is empty, use the current conversation context.
