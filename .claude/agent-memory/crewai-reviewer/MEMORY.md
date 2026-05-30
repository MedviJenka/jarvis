# CrewAI Reviewer Memory

## Key Files
- Base infra: `backend/core/ai/utils/infra.py` — AgentInfrastructure dataclass, llm cached_property
- All agents: `backend/core/ai/agents/{name}/` — crew.py, flow.py, schemas.py, config/agents.yaml, config/tasks.yaml
- Tools: `backend/core/ai/tools/`

## Confirmed Agent Inventory
- notam_agent — 3-task crew (interpretation -> prioritization -> briefing), NotamTool, NotamBriefingOutput
- forecast_agent — 3-task crew (metar_analysis -> taf_analysis -> weather_conclusion)
- rag_agent, debriefing_agent, english_agent, security_agent, vision_agent — not yet reviewed

## Recurring Bugs Found

### 1. Missing `allow_delegation: false` in agents.yaml
CrewAI defaults allow_delegation to true if the key is absent. Leaf agents in single-agent
crews must always have allow_delegation: false. Both notam_agent and forecast_agent were missing it.

### 2. Final task expected_output never mentions JSON or schema field names
The single most impactful reliability fix. The last task in every crew must describe the exact
JSON structure — field names, nesting, and types — that the Pydantic output_pydantic model expects.
Without this, the LLM produces prose or partial JSON that fails Pydantic parsing.

### 3. `capabilities` key in agents.yaml is not a CrewAI field
Found in notam_agent. It silently does nothing. Remove it — only recognized keys:
verbose, role, goal, backstory, reasoning, allow_delegation, inject_date, model, llm.

### 4. `{airport}` placeholder label mismatch in notam_interpretation
Task said "NOTAM payload: {airport}" implying the variable holds raw data. In reality
{airport} is the ICAO code string — the agent calls NotamTool to fetch data.
Fix: label as "ICAO airport code: {airport}" and instruct the agent to invoke the tool.

### 5. `reasoning: true` with `max_iter=5` is expensive for parsing tasks
NOTAM agent had both. Deterministic parsing/classification tasks should use reasoning: false.
max_iter=5 is acceptable for tool-calling tasks but not pure synthesis steps.

## YAML Patterns That Work

### Intermediate task expected_output: pipe-delimited line format
Use structured line format for intermediate tasks so next task has machine-readable input:
  [id] | [airport] | [starts_at] | [ends_at] | [description]
More robust than mid-chain JSON (JSON mid-chain breaks context threading).

### Final task description: embed full schema inline
Copy every field name and nesting level from the Pydantic schema into the task description.
Show an example JSON snippet. The LLM reliably follows this pattern.

### NO_DATA sentinel propagation
Use a single uppercase sentinel word (NO_DATA) that each task checks for in its IMPORTANT block.
More reliable than multi-word phrases which the LLM may paraphrase differently.

### Severity classification: concrete examples, not just label names
"CRITICAL -> runway closure, major nav outage" works; "WARNING -> limited service" is too vague.
Include specific examples: ILS Cat II/III outage, TFR, parachute ops, braking action reports.

## Schema Conventions (this codebase)
- All output schemas use Pydantic BaseModel (not dataclass or TypedDict)
- model_config = ConfigDict(extra='forbid') on root output models
- Nested sub-schemas used for complex fields (NotamSummary, OperationalAdvice, NotamItem, AffectedElement)
- List fields default to [] not None
- status field pattern: str = Field(..., description="complete or failed") on root model
