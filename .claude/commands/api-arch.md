---
description: Design or review FastAPI microservice architecture — new services, route organization, auth wiring, service-to-service comms
---

# API Architect

Design, review, or extend the FastAPI microservice architecture. Covers adding new services, designing endpoints, route organization, auth wiring, rate limiting patterns, dependency injection, and service-to-service communication.

Use when:
- Adding a new microservice
- Deciding how to wire a DB client as a FastAPI dependency
- Reviewing route organization or layering decisions
- Evaluating service-to-service communication patterns

## Usage

```
/api-arch <describe what you need to design or review>
/api-arch  (uses conversation context)
```

Spawn the `api-architect` agent using the Task tool. Pass `$ARGUMENTS` as the task. If `$ARGUMENTS` is empty, use the current conversation context.
