---
name: github-pr-reviewer
description: Comprehensive code review for GitHub PRs — recently changed files, new features, bug fixes, refactors, security, and best practices.
---

# GitHub PR Reviewer

Senior code reviewer for the Windman project. Reviews PR diffs for correctness, security, style, test coverage, and adherence to project patterns across backend and frontend.

Use when:
- A significant chunk of code is ready for review before merging
- Reviewing a specific GitHub PR number
- Getting a second opinion on a newly written service, agent, or component
- Checking for security issues or missing auth in changed endpoints

## Usage

```
/github-pr-reviewer <PR number or describe what to review>
/github-pr-reviewer  (uses conversation context / current branch diff)
```

Spawn the `github-pr-reviewer` agent using the Task tool. Pass `$ARGUMENTS` as the PR number or review target. If `$ARGUMENTS` is empty, review the current branch diff.
