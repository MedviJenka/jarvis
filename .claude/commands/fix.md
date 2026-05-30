---
description: Sequential pipeline — review changed files, fix every issue found, validate with tests
---

# Review → Fix → Test Pipeline

Runs three agents in sequence on recently changed code:
1. **Reviewer** — finds bugs, anti-patterns, and standard violations
2. **Resolver** — fixes every issue the Reviewer reported
3. **Validator** — runs build, typecheck, lint, and tests to confirm nothing is broken

Use when:
- You finished implementing something and want a full quality pass before committing
- A PR review flagged issues you want to fix and verify automatically
- Running as a pre-commit gate on a feature branch

## Usage

```
/fix                     (auto-detects changed files from git diff)
/fix <file or path>      (target specific files)
```

## Pipeline

Execute the three phases below **sequentially** — each agent must complete before the next starts.

### Phase 1 — Review

Detect changed files:
- Run `git diff --name-only HEAD` and `git diff --name-only --cached`
- If `$ARGUMENTS` is provided, use those files instead
- If no changes found, report "No changes to review" and stop

Spawn the `Reviewer` agent:
```
subagent_type: Reviewer
prompt: "Review these changed files for bugs, Windman coding standard violations
(CLAUDE.md rules 1-10), and correctness issues. Focus on: auth wiring, error
handling, async patterns, Pydantic schema compliance, and NASA Power of Ten rules.
FILES: {changed_files}
Return a structured list: each issue with file, line, severity (P0/P1/P2), and
a concrete fix description. P0 = broken/security, P1 = correctness, P2 = style."
```

Wait for completion. Extract: ISSUES_LIST, has_p0_or_p1 (bool).

If no P0 or P1 issues found: report "Review passed — no fixes needed" and run Phase 3 (validate only).

### Phase 2 — Fix

Spawn the `Resolver` agent:
```
subagent_type: Resolver
prompt: "Fix all P0 and P1 issues listed below. For each fix: make the minimal
change that resolves the issue without introducing new behaviour. Do not refactor
beyond what is needed to fix the reported problem.
ISSUES:
{issues_list}
FILES: {changed_files}
After fixing, report: list of files modified, one-line description of each fix."
```

Wait for completion. Extract: FIXED_FILES list.

### Phase 3 — Validate

Spawn the `Validator` agent:
```
subagent_type: Validator
prompt: "Run validation on the files that were reviewed and fixed.
FILES: {changed_files + fixed_files}
Run in order: ruff check, then pytest tests/ -m smoke -q.
Report PASS or FAIL with any error output."
```

Wait for completion.

## Report

Display summary:

```
## Fix Pipeline Complete

Phase 1 — Review:   {n} issues found (P0: x, P1: y, P2: z)
Phase 2 — Fix:      {n} issues resolved across {n} files
Phase 3 — Validate: PASS / FAIL

### Fixed Issues
{list}

### Remaining (P2 style suggestions — not auto-fixed)
{list}
```

If Validator reports FAIL: surface the error output and halt. Do not commit.
