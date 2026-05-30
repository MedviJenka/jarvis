---
description: Write, review, or modify Supabase database clients in core/database/ — schemas, query methods, patterns
---

# Supabase Database Agent

Writes and reviews Supabase database client code in `core/database/`. Creates new domain-specific clients, adds query methods, defines Pydantic schemas for DB models, and ensures code follows project patterns (`DatabaseClient` inheritance, `cached_property client`).

Use when:
- Creating a new domain database client
- Adding a query method to an existing client
- Defining or updating Pydantic schemas for DB models
- Reviewing database code for pattern compliance

## Usage

```
/db <describe what you need>
/db  (uses conversation context)
```

Spawn the `supabase-database-agent` agent using the Task tool. Pass `$ARGUMENTS` as the task. If `$ARGUMENTS` is empty, use the current conversation context.
