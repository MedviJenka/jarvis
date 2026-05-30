from pydantic import BaseModel, Field


class ClaudePipelineSchema(BaseModel):
    name:       str  = Field(...,                  description='pipeline name')
    agent_list: list = Field(default_factory=list, description='captured agents list')
