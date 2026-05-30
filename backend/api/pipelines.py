from fastapi import APIRouter
from pydantic import BaseModel
from backend.core.settings import Config
from backend.services.claude_parser import (
    parse_all_agents, parse_all_commands, detect_pipelines
)

router = APIRouter()


class PipelineStep(BaseModel):
    agent_name: str
    label: str
    description: str


class PipelineResponse(BaseModel):
    name: str
    description: str
    steps: list[PipelineStep]
    command_file: str
    is_custom: bool


class PipelineListResponse(BaseModel):
    pipelines: list[PipelineResponse]
    total: int


class PipelineCreateRequest(BaseModel):
    name: str
    description: str
    steps: list[PipelineStep]


class PipelineCreateResponse(BaseModel):
    pipeline: PipelineResponse
    file_created: str


@router.get("/", response_model=PipelineListResponse)
def list_pipelines():
    claude_dir = Config.claude_path
    agents = parse_all_agents(claude_dir)
    commands = parse_all_commands(claude_dir)
    pipelines_raw = detect_pipelines(commands, agents)
    result = []
    for p in pipelines_raw:
        steps = [PipelineStep(agent_name=s["agent_name"], label=s["label"], description=s["description"]) for s in p["steps"]]
        result.append(PipelineResponse(name=p["name"], description=p["description"], steps=steps, command_file=p["command_file"], is_custom=p["is_custom"]))
    return PipelineListResponse(pipelines=result, total=len(result))


@router.post("/create", response_model=PipelineCreateResponse)
def create_pipeline(body: PipelineCreateRequest):
    claude_dir = Config.claude_path
    commands_dir = claude_dir / "commands"
    commands_dir.mkdir(exist_ok=True)

    # Generate command file content
    steps_list = "\n".join([f"- **Step {i+1} ({s.label})**: {s.description}" for i, s in enumerate(body.steps)])
    agent_chain = " -> ".join([s.label for s in body.steps])
    content = f"""---
description: "{body.description}"
---

# {body.name.replace("-", " ").title()}

{body.description}

## Pipeline: {agent_chain}

{steps_list}

## Usage

```
/{body.name} <describe task>
```

Run each agent sequentially: {agent_chain}.
"""
    file_path = commands_dir / f"{body.name}.md"
    file_path.write_text(content, encoding="utf-8")

    pipeline = PipelineResponse(
        name=body.name,
        description=body.description,
        steps=body.steps,
        command_file=f"commands/{body.name}.md",
        is_custom=True,
    )
    return PipelineCreateResponse(pipeline=pipeline, file_created=str(file_path))
