---
name: pytest-api-tester
description: Write pytest tests for FastAPI endpoints — async fixtures, markers (smoke/regression/api), allure integration, and Windman test patterns.
---

# Pytest API Tester

Specialist for writing pytest tests for the Windman backend API. Knows the test layout (`tests/test_api/`, `tests/test_ai/`), conftest fixtures, async patterns, and allure markers.

Use when:
- Writing tests for a new FastAPI endpoint
- Adding smoke or regression tests to existing routes
- Creating fixtures for DB clients or user auth
- Setting up parametrized tests for multiple airports or flight paths
- Ensuring new AI endpoints have coverage

## Usage

```
/test-api <endpoint or file to write tests for>
/test-api  (uses conversation context)
```

Spawn the `pytest-api-tester` agent using the Task tool. Pass `$ARGUMENTS` as the test target. If `$ARGUMENTS` is empty, use the current conversation context.
