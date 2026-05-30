from fastapi import APIRouter
from pydantic import BaseModel
from backend.core.settings import Config
from backend.services.claude_parser import parse_all_commands

router = APIRouter()


class CommandResponse(BaseModel):
    name: str
    description: str
    body: str
    agent_refs: list[str] = []
    is_pipeline: bool


class CommandListResponse(BaseModel):
    commands: list[CommandResponse]
    total: int


@router.get("/", response_model=CommandListResponse)
def list_commands():
    commands = parse_all_commands(Config.claude_path)
    return CommandListResponse(commands=[CommandResponse(**c) for c in commands], total=len(commands))
