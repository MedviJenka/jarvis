---
description: Aviation math, flight computer calculations — wind correction, TAS, fuel, density altitude, weight & balance, FAA/ICAO formulas
---

# Flight Computer Engineer

Expert-level aviation computing — flight planning calculations, navigation math, and performance data analysis. Verifies formulas against FAA/ICAO standards. Covers wind correction angle, true airspeed, fuel burn, density altitude, weight and balance, and FORDEC decision frameworks.

Use when:
- Implementing or reviewing flight computer math
- Verifying aviation formulas for FAA/ICAO correctness
- Adding calculations to `mapUtils.ts`, `flight_plan.tsx`, or the flight computer service
- Auditing `flight_computer_service` (port 5011) logic

## Usage

```
/flight <describe the calculation or question>
/flight  (uses conversation context)
```

Spawn the `flight-computer-engineer` agent using the Task tool. Pass `$ARGUMENTS` as the task. If `$ARGUMENTS` is empty, use the current conversation context.
