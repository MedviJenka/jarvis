---
description: Review CrewAI agent crew/flow implementations, YAML configs, output schemas, and task chaining
---

# CrewAI Reviewer

Expert review of existing CrewAI agent implementations — crew.py, flow.py, agents.yaml, tasks.yaml, and Pydantic output schemas. Checks correctness and reliability, not architecture (use /crewai-architect for design).

Use when:
- You wrote or modified a crew or flow
- Agent YAML configs changed
- Output schemas were updated
- Agent behavior is inconsistent or wrong

## Usage

```
/review-crewai <agent name or file path>
/review-crewai  (uses conversation context)
```

Spawn the `crewai-reviewer` agent using the Task tool. Pass `$ARGUMENTS` as the target. If `$ARGUMENTS` is empty, use the current conversation context.
