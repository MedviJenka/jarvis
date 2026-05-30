import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "jarvis.db"


def _conn() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with _conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS agent_runs (
                id TEXT PRIMARY KEY,
                agent_name TEXT NOT NULL,
                triggered_by TEXT,
                status TEXT NOT NULL DEFAULT 'running',
                input_summary TEXT,
                output_summary TEXT,
                error_msg TEXT,
                started_at TEXT NOT NULL,
                finished_at TEXT,
                duration_ms INTEGER
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS agent_status_overrides (
                agent_name TEXT PRIMARY KEY,
                status TEXT NOT NULL,
                note TEXT,
                updated_at TEXT NOT NULL
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_runs_agent ON agent_runs(agent_name)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_runs_started ON agent_runs(started_at DESC)")


def log_run(agent_name: str, triggered_by: str | None, input_summary: str | None) -> str:
    run_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    with _conn() as conn:
        conn.execute(
            "INSERT INTO agent_runs (id, agent_name, triggered_by, status, input_summary, started_at) VALUES (?,?,?,?,?,?)",
            (run_id, agent_name, triggered_by, "running", input_summary, now),
        )
    return run_id


def finish_run(run_id: str, status: str, output_summary: str | None, error_msg: str | None):
    now = datetime.now(timezone.utc).isoformat()
    with _conn() as conn:
        row = conn.execute("SELECT started_at FROM agent_runs WHERE id=?", (run_id,)).fetchone()
        duration_ms = None
        if row:
            try:
                started = datetime.fromisoformat(row["started_at"])
                finished = datetime.fromisoformat(now)
                duration_ms = int((finished - started).total_seconds() * 1000)
            except Exception:
                pass
        conn.execute(
            "UPDATE agent_runs SET status=?, output_summary=?, error_msg=?, finished_at=?, duration_ms=? WHERE id=?",
            (status, output_summary, error_msg, now, duration_ms, run_id),
        )


def get_runs(agent_name: str | None = None, limit: int = 50) -> list[dict]:
    with _conn() as conn:
        if agent_name:
            rows = conn.execute(
                "SELECT * FROM agent_runs WHERE agent_name=? ORDER BY started_at DESC LIMIT ?",
                (agent_name, limit),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM agent_runs ORDER BY started_at DESC LIMIT ?", (limit,)
            ).fetchall()
    return [dict(r) for r in rows]


def get_run(run_id: str) -> dict | None:
    with _conn() as conn:
        row = conn.execute("SELECT * FROM agent_runs WHERE id=?", (run_id,)).fetchone()
    return dict(row) if row else None


def get_agent_health(agent_name: str) -> dict:
    with _conn() as conn:
        row = conn.execute(
            """SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status='error' THEN 1 ELSE 0 END) as errors,
                MAX(started_at) as last_run
               FROM agent_runs WHERE agent_name=?""",
            (agent_name,),
        ).fetchone()
        override = conn.execute(
            "SELECT status FROM agent_status_overrides WHERE agent_name=?", (agent_name,)
        ).fetchone()

    total = row["total"] or 0
    errors = row["errors"] or 0
    last_run = row["last_run"]

    if override:
        status = override["status"]
    elif total == 0:
        status = "unknown"
    elif total > 0 and errors == 0:
        status = "healthy"
    elif errors == total:
        status = "error"
    else:
        status = "degraded"

    return {
        "status": status,
        "run_count": total,
        "error_count": errors,
        "last_run_at": last_run,
    }


def set_status_override(agent_name: str, status: str, note: str | None):
    now = datetime.now(timezone.utc).isoformat()
    with _conn() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO agent_status_overrides (agent_name, status, note, updated_at) VALUES (?,?,?,?)",
            (agent_name, status, note, now),
        )
