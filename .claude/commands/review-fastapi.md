---
description: Review FastAPI routers, endpoints, auth wiring, dependencies, response schemas, and error handling
---

# FastAPI Reviewer

Expert review, design guidance, or debugging for FastAPI code. Checks auth wiring (`Depends(get_current_user)`), Pydantic response models, rate-limit pattern compliance, lifespan handlers, and error handling against Windman backend conventions.

Use when:
- You added or modified an API endpoint
- Debugging a 422 or 500 from a backend service
- Creating a new microservice scaffold
- Refactoring a router or dependency chain

## Usage

```
/review-fastapi <file path or description>
/review-fastapi  (uses conversation context)
```

Spawn the `fastapi-reviewer` agent using the Task tool. Pass `$ARGUMENTS` as the target. If `$ARGUMENTS` is empty, use the current conversation context.
