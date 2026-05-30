---
name: mapbox-navigation-ui
description: Build Mapbox GL map layers, interactions, and aviation navigation UI — airports, airspace, routes, markers, clustering, and side panels.
---

# Mapbox Navigation UI

Expert in Mapbox GL JS and React Native Mapbox SDK for aviation applications. Builds and debugs interactive map layers, aviation overlays, and the navigation screen in the Windman frontend.

Use when:
- Adding new aviation data layers to the navigation map (airspace, waypoints, NOTAMs)
- Implementing map interactions (tap, long-press, clustering, filtering)
- Debugging Mapbox rendering or performance issues
- Building airport info panels or map side drawers
- Integrating navigation data from the backend navigation_service

## Usage

```
/mapbox <describe the map feature or layer to build>
/mapbox  (uses conversation context)
```

Spawn the `mapbox-navigation-ui` agent using the Task tool. Pass `$ARGUMENTS` as the feature description. If `$ARGUMENTS` is empty, use the current conversation context.
