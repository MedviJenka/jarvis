from crewai import Agent, Task, LLM
from functools import cached_property
from dataclasses import dataclass
from backend.core.settings import Config


@dataclass
class AgentInfrastructure:

    agents: list[Agent] = None
    tasks: list[Task] = None
    agents_config: dict = "config/agents.yaml"
    tasks_config: dict = "config/tasks.yaml"
    temperature: float = 0.0
    model: str = Config.OPENAI_MODEL

    @cached_property
    def llm(self) -> LLM:
        return LLM(model=self.model, api_key=Config.OPENAI_API_KEY, temperature=self.temperature)
