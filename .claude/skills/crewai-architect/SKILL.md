---
name: crewai-architect
description: Design and build CrewAI multi-agent systems — crews, flows, task orchestration, agent roles, tool integrations, hierarchical processes.
---

# CrewAI Architect

Expert agent for designing CrewAI-based systems. Guides greenfield crew/flow design and improves existing ones. Understands the Windman two-layer pattern (crew.py + flow.py) and when to use Crews vs Flows.

Use when:
- Designing a new CrewAI agent for the Windman backend
- Choosing between a Crew and a Flow for a workflow
- Structuring multi-agent pipelines with branching logic
- Wiring tools, memory, or external APIs into a crew
- Debugging incorrect agent task sequencing

## Usage

```
/crewai-architect <describe the agent or workflow to design>
/crewai-architect  (uses conversation context)
```

Spawn the `crewai-architect` agent using the Task tool. Pass `$ARGUMENTS` as the design brief. If `$ARGUMENTS` is empty, use the current conversation context.
