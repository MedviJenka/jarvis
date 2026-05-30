from fastapi import APIRouter
from pydantic import BaseModel
from backend.core.settings import Config
from backend.services.claude_parser import (
    parse_all_agents, parse_all_skills, parse_all_commands, detect_pipelines, get_stats
)

router = APIRouter()


class StatsResponse(BaseModel):
    agent_count: int
    skill_count: int
    command_count: int
    pipeline_count: int
    category_breakdown: dict[str, int]
    model_breakdown: dict[str, int]


@router.get("/", response_model=StatsResponse)
def get_dashboard_stats():
    claude_dir = Config.claude_path
    agents = parse_all_agents(claude_dir)
    skills = parse_all_skills(claude_dir)
    commands = parse_all_commands(claude_dir)
    pipelines = detect_pipelines(commands, agents)
    stats = get_stats(agents, skills, commands, pipelines)
    return StatsResponse(**stats)
