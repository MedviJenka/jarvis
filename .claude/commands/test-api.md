---
description: Write pytest API tests for backend service endpoints — clean, parallel-ready, under 60 lines per test
---

# Pytest API Tester

Writes clean, parallel-ready pytest tests for Windman backend services. Tests go under `tests/test_api/`. Each test file stays under 60 lines. Triggered after adding/modifying API endpoints.

Use when:
- You added a new endpoint and need test coverage
- You modified endpoint behavior and need updated tests
- You want smoke tests for a service

## Usage

```
/test-api <endpoint or service to test>
/test-api  (uses conversation context)
```

Spawn the `pytest-api-tester` agent using the Task tool. Pass `$ARGUMENTS` as the target. If `$ARGUMENTS` is empty, use the current conversation context to determine what to test.
