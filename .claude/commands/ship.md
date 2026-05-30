---
description: Sequential pipeline — self-review changed code, then commit, push, and open a PR
---

# Self-Review → Commit → Push → PR Pipeline

Runs four stages in sequence to deliver a finished feature:
1. **Simplifier** — refines code for clarity and consistency
2. **Scrutinizer** — 9-pillar quality gate; fixes P0/P1 issues
3. **Validator** — confirms build + tests pass (only if Scrutinizer made changes)
4. **Git** — commits, pushes, and opens a PR against main

Use when:
- Implementation is complete and you want to deliver it end-to-end in one command
- Equivalent to running `/self-review` then committing and creating a PR

## Usage

```
/ship                        (auto-detects changed files, PR against main)
/ship <issue title or #n>    (uses the text as PR title / references the issue)
```

## Pipeline

Execute all phases **sequentially**.

### Phase 0 — Context

Detect changed files:
- Run `git diff --name-only HEAD` and `git diff --name-only --cached`
- Run `git log --oneline -5` to understand recent commit style
- Run `git branch --show-current` for branch name
- If no changes: report "Nothing to ship" and stop

Parse `$ARGUMENTS` for an issue number (e.g. `#41`) or title to use in the PR.

### Phase 1 — Simplifier

Spawn the `Simplifier` agent:
```
subagent_type: Simplifier
prompt: "Simplify and refine the changed code for clarity and consistency while
preserving all functionality. Focus only on recently modified sections.
FILES: {changed_files}"
```

Wait for completion.

### Phase 2 — Scrutinizer

Spawn the `Scrutinizer` agent:
```
subagent_type: Scrutinizer
prompt: "Evaluate the changed code against the 9-pillar framework (Design,
Functionality, Security, Complexity, Error Handling, Tests, Naming, Consistency,
Documentation). Fix all P0 and P1 issues. Apply Windman CLAUDE.md coding standards.
FILES: {changed_files}
Return: STATUS (PASS|FIXED|BLOCKED), list of issues found, list of fixes made."
```

Wait for completion. Extract: STATUS, made_changes (bool).

If STATUS == BLOCKED: surface the blocking issue to the user and halt. Do not commit.

### Phase 3 — Validate (conditional)

Run only if Scrutinizer made changes (STATUS == FIXED):

Spawn the `Validator` agent:
```
subagent_type: Validator
prompt: "Run validation on modified files.
Run: ruff check backend/, then pytest tests/ -m smoke -q.
Report PASS or FAIL with full error output on failure."
```

Wait for completion. If FAIL: surface errors and halt. Do not commit.

### Phase 4 — Git

Spawn the `Git` agent:
```
subagent_type: Git
prompt: "Commit all changed files, push to the current branch, and open a PR
against main.

Commit message style: conventional commits (fix/feat/chore/refactor).
Derive the message from the changes made — be specific about what changed and why.
If an issue number or title was provided, include 'Closes #N' in the commit body.

ISSUE_CONTEXT: {arguments}
CHANGED_FILES: {all_changed_files}

Steps:
1. git add {changed files — exclude .idea, .expo, *.local.json}
2. git commit with a descriptive conventional-commit message
3. git push origin {current_branch}
4. gh pr create targeting main, or gh pr edit if one already exists"
```

Wait for completion. Extract: PR_URL.

## Report

Display summary:

```
## Ship Complete

Phase 1 — Simplifier:   {n} files refined
Phase 2 — Scrutinizer:  {PASS|FIXED} — {n} issues fixed
Phase 3 — Validator:    {PASS|SKIPPED}
Phase 4 — Git:          committed + pushed

PR: {pr_url}
```
