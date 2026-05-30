from pydantic import BaseModel


class AgentSpec(BaseModel):
    name: str
    description: str
    category: str
    model: str
    color: str
    tools: list[str]
    system_prompt: str
    command_name: str
    skill_description: str


class GeneratedFiles(BaseModel):
    agent_md: str
    skill_md: str
    command_md: str
