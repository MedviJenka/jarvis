from crewai import Agent, Crew, Task, Process
from crewai.project import CrewBase, agent, crew, task
from backend.ai.settings import AgentInfrastructure
from backend.ai.agents.agent_generator.schemas import AgentSpec, GeneratedFiles


@CrewBase
class AgentGeneratorCrew(AgentInfrastructure):

    @agent
    def spec_designer(self) -> Agent:
        return Agent(config=self.agents_config["spec_designer"], llm=self.llm, verbose=False)

    @agent
    def file_writer(self) -> Agent:
        return Agent(config=self.agents_config["file_writer"], llm=self.llm, verbose=False)

    @task
    def design_spec(self) -> Task:
        return Task(config=self.tasks_config["design_spec"], output_pydantic=AgentSpec)

    @task
    def write_files(self) -> Task:
        return Task(config=self.tasks_config["write_files"], context=[self.design_spec()], output_pydantic=GeneratedFiles)

    @crew
    def crew(self) -> Crew:
        return Crew(agents=self.agents, tasks=self.tasks, process=Process.sequential, verbose=False)
