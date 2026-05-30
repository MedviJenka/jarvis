---
name: flight-computer-engineer
description: Aviation math and FAA/ICAO formulas — wind triangles, TAS, fuel planning, weight & balance, density altitude, and other flight computer calculations.
---

# Flight Computer Engineer

Expert in aviation mathematics and regulatory formulas. Implements or verifies calculations for the Windman flight_computer_service using FAA/ICAO standards.

Use when:
- Adding a new calculation to the flight computer service
- Verifying correctness of aviation math (wind, TAS, fuel, W&B)
- Implementing density altitude, pressure altitude, or performance calculations
- Checking unit conversions (knots, ft/min, nm, kg/lbs)
- Reviewing edge cases in aviation formulas

## Usage

```
/flight <describe the calculation or formula needed>
/flight  (uses conversation context)
```

Spawn the `flight-computer-engineer` agent using the Task tool. Pass `$ARGUMENTS` as the calculation request. If `$ARGUMENTS` is empty, use the current conversation context.
