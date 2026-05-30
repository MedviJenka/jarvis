# FastAPI Reviewer Memory

## Known Anti-patterns in This Codebase

### [CRITICAL] asyncio.run() inside a sync endpoint that is called from uvicorn's event loop
`api.py:102` — `get_ai_weather` is a SYNC `def` endpoint. FastAPI runs sync endpoints in a
threadpool executor. `asyncio.run()` inside that thread spins up a NEW event loop in the thread,
which works, but: (a) blocks the threadpool thread for the entire duration (~10s of LLM calls),
(b) response is fully buffered — uvicorn does not flush anything to the client until
`asyncio.run()` returns. The fix is to make the endpoint `async def` and `await
ai_briefing.kickoff_async(...)` directly — this keeps the work on the main event loop and
eliminates the thread overhead and new-event-loop setup cost.

### [CRITICAL] WeatherBriefingOutput has ConfigDict(extra="forbid") — LLM output mismatch risk
If gpt-4o-mini returns any extra field the Pydantic parse fails silently (CrewAI returns raw
string instead of .pydantic). The flow then crashes at `each_result.pydantic.model_dump()`
with AttributeError. Under load or with unexpected LLM output this is a source of 500 errors.

### [FIXED] crew.py:33 now uses akickoff — was sync kickoff in prior session
`run_agent` correctly uses `ForecastAgent().crew().akickoff(...)` (async). The prior note
about sync kickoff is resolved. The concurrency issue has moved: see the CRITICAL note below
about `asyncio.run()` at the top of the call chain blocking everything.

### [CRITICAL] Blocking HTTP in async context (core/api/v1/forecast/client.py)
`ForecastAPI.__fetch_data` uses `requests.get` (sync). This is called inside CrewAI tool `_run`,
which is called from within the crew execution. While currently inside a sync kickoff, any
migration to async will require replacing `requests` with `httpx.AsyncClient`.

### [MEDIUM] ForecastAPI cached_property on a dataclass (client.py)
`ForecastAPI` is a `@dataclass`. `cached_property` only works if the instance is not frozen and
has a `__dict__`. Dataclasses are not frozen by default so this works, but is fragile.
`get_taf` returns 'No METAR available' as the fallback string — this is a copy-paste bug
(should say 'No TAF available').

### [MEDIUM] increment_daily_request not in finally block (forecast api.py:102)
`increment_daily_request()` is called only on success path, not in a `finally` block.
This is correct per the documented pattern (only charge on success) but differs from notam_service
which uses finally. The team should standardise one approach.

### [LOW] DB hit on rate-limit check: 2 round trips minimum
`get_current_api_usage` does a full SELECT on every request. `increment_daily_request` then does
another SELECT inside itself (reads current count again at line 106) before writing. That is
3 Supabase round trips per successful AI request, all synchronous/blocking.

## Confirmed Patterns

- `run_agent` in forecast_agent is the entry point called by the API endpoint via `asyncio.gather`
- ForecastTool calls METAR and TAF in the same `_run` invocation (one external HTTP round trip)
- Three sequential LLM tasks per airport: metar_analysis → taf_analysis → weather_conclusion
- `weather_conclusion` uses `context: [taf_analysis, metar_analysis]` — CrewAI passes prior
  task outputs as context, so the agent re-reads both outputs for the third call
- `AgentInfrastructure.llm` is a `cached_property` — LLM instance is reused across tasks within
  one crew run but a NEW `ForecastAgent()` is instantiated per `run_agent` call

## File Paths (key files)
- `backend/core/api/v1/forecast/api.py` — endpoint
- `backend/core/ai/agents/forecast_agent/crew.py` — run_agent, ForecastAgent
- `backend/core/ai/agents/forecast_agent/config/tasks.yaml` — 3 sequential tasks
- `backend/core/ai/agents/forecast_agent/config/agents.yaml` — single agent, gpt-4o-mini
- `backend/core/api/v1/forecast/client.py` — ForecastAPI (sync requests)
- `backend/core/ai/tools/forecast_tool.py` — ForecastTool._run (sync, calls ForecastAPI)
- `backend/core/database/users/client.py` — UserDatabaseClient, increment_daily_request
- `backend/core/ai/utils/infra.py` — AgentInfrastructure base class

## See Also
- patterns.md — detailed breakdown of async/concurrency issues
