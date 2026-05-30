---
description: Refine a vague idea or rough prompt into a precise, Windman-compatible implementation spec
---

# Windman Prompt Refiner

Turns rough feature ideas into fully-specified, standards-compliant implementation prompts — with correct file paths, Pydantic schemas, auth wiring, CrewAI structure, and NASA Power of Ten compliance embedded.

Use when:
- You have a vague feature idea and want a precise spec before coding
- You want to make sure a new endpoint, agent, or component aligns with Windman patterns
- You're about to ask Claude to build something and want the prompt to be airtight

## Usage

```
/refine <rough idea or feature description>
/refine  (describe in the next message)
```

Spawn the `windman-prompt-refiner` agent using the Task tool. Pass `$ARGUMENTS` as the input to refine. If `$ARGUMENTS` is empty, ask the user to describe what they want to build.
