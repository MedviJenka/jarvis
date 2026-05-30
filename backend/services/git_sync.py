import subprocess
from datetime import datetime, timezone
from pathlib import Path

_last_synced: str | None = None


def git_pull(claude_dir: Path) -> dict:
    global _last_synced
    if not (claude_dir / ".git").exists():
        return {"success": False, "output": "CLAUDE_DIR is not a git repository", "synced_at": _last_synced}
    try:
        result = subprocess.run(
            ["git", "pull"],
            cwd=str(claude_dir),
            capture_output=True,
            text=True,
            timeout=30,
        )
        _last_synced = datetime.now(timezone.utc).isoformat()
        return {
            "success": result.returncode == 0,
            "output": (result.stdout or result.stderr).strip(),
            "synced_at": _last_synced,
        }
    except subprocess.TimeoutExpired:
        return {"success": False, "output": "git pull timed out", "synced_at": _last_synced}
    except Exception as e:
        return {"success": False, "output": str(e), "synced_at": _last_synced}


def get_last_synced() -> str | None:
    return _last_synced
