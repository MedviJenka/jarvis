from fastapi import APIRouter
from pydantic import BaseModel
from backend.core.settings import Config
from backend.services.claude_parser import parse_all_skills

router = APIRouter()


class SkillResponse(BaseModel):
    name: str
    description: str
    body: str


class SkillListResponse(BaseModel):
    skills: list[SkillResponse]
    total: int


@router.get("/", response_model=SkillListResponse)
def list_skills():
    skills = parse_all_skills(Config.claude_path)
    return SkillListResponse(skills=[SkillResponse(**s) for s in skills], total=len(skills))
