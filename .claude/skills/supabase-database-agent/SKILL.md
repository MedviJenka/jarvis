---
name: supabase-database-agent
description: Write and review Supabase/Postgres database client code — queries, schema design, RLS policies, DatabaseClient subclasses, and migrations.
---

# Supabase Database Agent

Expert for writing and reviewing `core/database/` client code in the Windman backend. Implements `DatabaseClient` subclasses, Supabase table queries, and schema-level logic following project patterns.

Use when:
- Adding a new `DatabaseClient` subclass for a new domain
- Writing or reviewing Supabase table queries
- Designing RLS policies or schema changes
- Implementing `increment_daily_request` style counters or aggregations
- Debugging unexpected Supabase query results or auth issues

## Usage

```
/db <describe the database task or client to write>
/db  (uses conversation context)
```

Spawn the `supabase-database-agent` agent using the Task tool. Pass `$ARGUMENTS` as the database task. If `$ARGUMENTS` is empty, use the current conversation context.
