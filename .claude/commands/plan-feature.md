---
description: Plan and scope a new feature end-to-end — user flows, impacted services, and structured delivery plan
---

# Feature Planner

Translates vague ideas into actionable feature specifications. Defines user flows, identifies impacted services (frontend + backend), and produces a structured plan aligned with existing Windman architecture.

Use when:
- You have a feature idea and need to scope it out
- You want a structured plan before writing any code
- You need to identify which services and components are affected

## Usage

```
/plan-feature <describe the feature idea>
/plan-feature  (uses conversation context)
```

Spawn the `feature-planner` agent using the Task tool. Pass `$ARGUMENTS` as the feature description. If `$ARGUMENTS` is empty, use the current conversation context.
