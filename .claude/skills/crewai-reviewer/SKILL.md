---
name: crewai-reviewer
description: Expert review of CrewAI agent implementations — crew/flow code, YAML configs, output schemas, task chaining, and output reliability.
---

# CrewAI Reviewer

Senior CrewAI engineer that audits existing agent implementations for correctness, reliability, and alignment with Windman's two-layer crew/flow pattern.

Use when:
- A new agent crew or flow was just written
- An existing agent produces inconsistent or incomplete outputs
- Agent YAML configs (agents.yaml / tasks.yaml) were modified
- Output Pydantic schemas need validation
- Task context threading or chaining looks broken

## Usage

```
/review-crewai <path or agent name to review>
/review-crewai  (uses conversation context)
```

Spawn the `crewai-reviewer` agent using the Task tool. Pass `$ARGUMENTS` as the review target. If `$ARGUMENTS` is empty, use the current conversation context.
