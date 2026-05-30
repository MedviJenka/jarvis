---
name: feature-planner
description: Scope and plan Windman features end-to-end — backend service design, frontend screens, CrewAI agents, K8s infra, and test strategy.
---

# Feature Planner

Full-stack feature planning agent for the Windman aviation app. Produces complete implementation plans that cover backend, frontend, AI agents, infrastructure, and testing — before a line of code is written.

Use when:
- Starting a significant new feature (new service, new screen, new AI agent)
- Clarifying scope and identifying all affected files before implementation
- Estimating complexity and dependency order
- Producing a plan to align with before coding

## Usage

```
/plan-feature <describe the feature to plan>
/plan-feature  (uses conversation context)
```

Spawn the `feature-planner` agent using the Task tool. Pass `$ARGUMENTS` as the feature description. If `$ARGUMENTS` is empty, use the current conversation context.
