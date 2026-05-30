---
description: Build or modify Mapbox navigation map UI — aviation overlays, map layers, gestures, markers, and layer styling
---

# Mapbox Navigation UI

Expert agent for the Mapbox-powered navigation map in the Windman app. Covers aviation overlays (airports, navaids, airspace, waypoints), map interactions (gestures, long-press, markers), layer styling, and integration with the navigation service.

Use when:
- Adding a new aviation layer or overlay to the map
- Implementing map interactions (long-press, clustering, selection)
- Debugging Mapbox rendering issues
- Integrating navigation service data into map layers

## Usage

```
/mapbox <describe the map feature or issue>
/mapbox  (uses conversation context)
```

Spawn the `mapbox-navigation-ui` agent using the Task tool. Pass `$ARGUMENTS` as the task. If `$ARGUMENTS` is empty, use the current conversation context.
