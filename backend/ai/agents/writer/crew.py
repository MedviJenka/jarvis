from crewai import Agent, Crew, Task
from backend.core.settings import Config
from backend.ai.settings import AgentInfrastructure
from crewai.project import CrewBase, agent, crew, task


@CrewBase
class ClaudePipelineAgent(AgentInfrastructure):

    @agent
    def agent(self) -> Agent:
        return Agent(config=self.agents_config['agent'], verbose=Config.AGENT_VERBOSE)

    @task
    def task(self, **kwargs) -> Task:
        return Task(config=self.tasks_config['task'], **kwargs)

    @crew
    def crew(self) -> Crew:
        return Crew(agents=self.agents, tasks=self.tasks)
