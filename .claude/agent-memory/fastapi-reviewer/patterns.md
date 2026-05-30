# Async / Concurrency Patterns — Detailed Notes

## Forecast service: root cause of 30-60s response times

Traced through the full call chain:

```
GET /ai_weather?airport=LLBG&airport=LLHA
  → asyncio.gather([run_agent('LLBG'), run_agent('LLHA')])
      → run_agent is async but body is sync kickoff()
          → ForecastAgent().crew().kickoff({...})
              → task 1: metar_analysis  (1 LLM call, tool call inside)
              → task 2: taf_analysis    (1 LLM call, tool call inside)
              → task 3: weather_conclusion (1 LLM call, no tool)
```

### Issue 1: False concurrency from asyncio.gather over sync functions
`asyncio.gather` schedules coroutines on the event loop. `run_agent` IS a coroutine
(declared `async def`) but its entire body is:
  `ForecastAgent().crew().kickoff(...)` — synchronous, CPU/IO-blocking call.
There is no `await` anywhere in `run_agent`. So:
- When gather runs coroutine 1, it starts executing synchronously until `.kickoff()` returns.
- `.kickoff()` blocks the thread (and therefore the event loop) for its entire duration.
- Coroutine 2 never gets scheduled until coroutine 1 finishes.
- Result: N airports = N * (single-airport latency), not max(latencies).
For 2 airports at 15s each, total = 30s. For 3 = 45s. This is the primary bottleneck.

### Issue 2: 3 sequential LLM calls per airport (tasks.yaml)
Each airport runs three tasks in sequence inside the crew:
1. metar_analysis — LLM call (~3-8s with gpt-4o-mini)
2. taf_analysis   — LLM call (~3-8s with gpt-4o-mini)
3. weather_conclusion — LLM call (~3-8s), reads output of both above via `context:`

These cannot run in parallel because task 3 depends on tasks 1 and 2. However, tasks 1 and 2
have no dependency on each other — they both receive the same `{airport}` input and call the
same ForecastTool. They could in principle be parallelised, but CrewAI's default sequential
process does not do this without `Process.hierarchical` or explicit parallel task config.

Furthermore: the ForecastTool already fetches BOTH metar AND taf in a single `_run` call
(returns `{'metar': ..., 'taf': ...}`). This means the agent has both data sets available
after task 1's tool call, yet task 2 makes a SECOND identical tool call to the same external
API to get the same data. That is a redundant external HTTP round trip.

### Issue 3: Blocking HTTP inside tool (ForecastTool / ForecastAPI)
`ForecastTool._run` calls `ForecastAPI.get_metar` and `ForecastAPI.get_taf`, both of which
call `requests.get` (synchronous). These are network I/O operations (~200-800ms each)
running on the event loop thread. With the sync kickoff pattern this is currently contained,
but it adds latency per tool invocation.

### Issue 4: Redundant DB round trips per request
Before the AI call:
  1. `db.get_current_api_usage` → SELECT (psycopg2/Supabase, sync, blocking)
After:
  2. `db.increment_daily_request` → internally calls `get_current_api_usage` AGAIN (line 106
     of client.py: `self.schema.request_count = self.get_current_api_usage + 1`)
     → second SELECT, then UPDATE
Total = 3 synchronous Supabase round trips bracketing every AI call.

### Issue 5: ForecastAgent instantiated fresh per call
`run_agent` does `ForecastAgent()` on every invocation. `AgentInfrastructure.llm` is a
`cached_property` but caching is per-instance, so a new LLM object is constructed per call.
This involves API key validation / LLM init overhead on each invocation.

## Latency budget estimate (2 airports, single call)
- DB SELECT (usage check):     ~200ms
- Airport 1 serialised kickoff:
    - metar_analysis: tool HTTP + LLM   ~5-10s
    - taf_analysis:   tool HTTP + LLM   ~5-10s  (redundant HTTP!)
    - weather_conclusion: LLM           ~3-8s
    - subtotal:                         ~13-28s
- Airport 2 serialised kickoff: same   ~13-28s
- DB SELECT + UPDATE (increment):      ~400ms
Total:                                  ~27-57s  ← matches observed 30-60s window
