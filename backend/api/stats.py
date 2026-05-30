from fastapi import APIRouter
from pydantic import BaseModel
from backend.core.settings import Config
from backend.services.claude_parser import (
    parse_all_agents, parse_all_skills, parse_all_commands, detect_pipelines, get_stats
)
from backend.services.git_sync import get_last_synced
from backend.services import db

router = APIRouter()


class StatsResponse(BaseModel):
    agent_count: int
    skill_count: int
    command_count: int
    pipeline_count: int
    category_breakdown: dict[str, int]
    model_breakdown: dict[str, int]
    last_synced: str | None
    health_breakdown: dict[str, int]


@router.get("/", response_model=StatsResponse)
def get_dashboard_stats():
    claude_dir = Config.claude_path
    agents = parse_all_agents(claude_dir)
    skills = parse_all_skills(claude_dir)
    commands = parse_all_commands(claude_dir)
    pipelines = detect_pipelines(commands, agents)
    stats = get_stats(agents, skills, commands, pipelines)

    health_breakdown: dict[str, int] = {}
    for a in agents:
        h = db.get_agent_health(a["name"])
        s = h["status"]
        health_breakdown[s] = health_breakdown.get(s, 0) + 1

    return StatsResponse(
        **stats,
        last_synced=get_last_synced(),
        health_breakdown=health_breakdown,
    )
