from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.core.settings import Config
from backend.services.claude_parser import (
    parse_all_agents, parse_all_commands, build_linked_commands
)

router = APIRouter()


class AgentResponse(BaseModel):
    name: str
    description: str
    description_full: str
    category: str
    model: str
    color: str
    tools: list[str] = []
    memory_type: str = "none"
    skill: str | None = None
    system_prompt_preview: str
    linked_commands: list[str] = []
    has_memory: bool


class AgentListResponse(BaseModel):
    agents: list[AgentResponse]
    total: int


class AgentCreateRequest(BaseModel):
    name: str
    description: str
    category: str
    tools: list[str] = []
    model: str = "sonnet"
    extra_context: str = ""


class AgentCreateResponse(BaseModel):
    agent: AgentResponse
    files_created: list[str]


def _get_agents_with_links():
    claude_dir = Config.claude_path
    agents = parse_all_agents(claude_dir)
    commands = parse_all_commands(claude_dir)
    links = build_linked_commands(agents, commands)
    for a in agents:
        a["linked_commands"] = links.get(a["name"], [])
    return agents


@router.get("/", response_model=AgentListResponse)
def list_agents():
    agents = _get_agents_with_links()
    return AgentListResponse(agents=[AgentResponse(**a) for a in agents], total=len(agents))


@router.get("/{name}", response_model=AgentResponse)
def get_agent(name: str):
    agents = _get_agents_with_links()
    for a in agents:
        if a["name"] == name:
            return AgentResponse(**a)
    raise HTTPException(status_code=404, detail=f"Agent '{name}' not found")


@router.post("/create", response_model=AgentCreateResponse)
async def create_agent(body: AgentCreateRequest):
    from backend.ai.agents.agent_generator.flow import AgentGeneratorFlow, AgentGeneratorState
    state = AgentGeneratorState(
        name=body.name,
        user_description=body.description,
        category=body.category,
        tools=body.tools,
        extra_context=body.extra_context,
    )
    flow = AgentGeneratorFlow()
    flow.state = state
    result = await flow.kickoff_async()
    # Re-parse to get the newly created agent
    agents = _get_agents_with_links()
    created = next((a for a in agents if a["name"] == body.name), None)
    if not created:
        raise HTTPException(status_code=500, detail="Agent created but could not be read back")
    return AgentCreateResponse(
        agent=AgentResponse(**created),
        files_created=flow.state.files_written,
    )
