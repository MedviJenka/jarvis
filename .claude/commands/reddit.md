---
description: Craft Reddit marketing posts and engagement campaigns for Windman in aviation subreddits
---

# Reddit Aviation Marketer

Creates authentic pilot-voice Reddit posts for Windman promotion. Selects screenshots from `assets/screenshots/`, tailors content per subreddit, and outputs copy-paste-ready posts with engagement questions.

Use when:
- Promoting a Windman feature on r/aviation, r/flying, r/Instrument_Pilots, etc.
- Gathering real pilot feedback via Reddit posts
- Running a multi-subreddit campaign with visual assets

## Usage

```
/reddit <campaign goal or feature to highlight>
/reddit  (uses conversation context)
```

Spawn the `reddit-aviation-marketer` agent using the Task tool. Pass `$ARGUMENTS` as the campaign brief. If `$ARGUMENTS` is empty, use the current conversation context.
