---
name: react-native-ui-reviewer
description: Review React Native UI for visual quality, accessibility, design language adherence, and best practices after code is written or modified.
---

# React Native UI Reviewer

Professional reviewer for Windman's React Native / Expo frontend. Checks visual quality, gradient usage, tab sizing, accessibility, and adherence to the project's design language after UI code is written.

Use when:
- A new screen, tab, or component was just implemented
- Wanting a UX quality check before merging frontend changes
- Verifying accessibility (aria-labels, touch targets, contrast)
- Checking that colors match the Windman design system (#071325, #101c2e, #1f2a3d)
- Reviewing navigation structure or tab bar design

## Usage

```
/review-react-ui <component or screen to review>
/review-react-ui  (uses conversation context / recently changed files)
```

Spawn the `react-native-ui-reviewer` agent using the Task tool. Pass `$ARGUMENTS` as the review target. If `$ARGUMENTS` is empty, review recently modified frontend files.
