import re
from crewai.flow.flow import Flow, start, listen
from pydantic import BaseModel, Field
from backend.ai.agents.agent_generator.crew import AgentGeneratorCrew
from backend.core.settings import Config


class AgentGeneratorState(BaseModel):
    name: str = ""
    user_description: str = ""
    category: str = ""
    tools: list[str] = Field(default_factory=list)
    extra_context: str = ""
    files_written: list[str] = Field(default_factory=list)


class AgentGeneratorFlow(Flow[AgentGeneratorState]):

    @start()
    def run_crew(self):
        result = AgentGeneratorCrew().crew().kickoff(inputs={
            "name": self.state.name,
            "user_description": self.state.user_description,
            "category": self.state.category,
            "tools": ", ".join(self.state.tools) if self.state.tools else "Glob, Grep, Read",
            "extra_context": self.state.extra_context or "None",
        })
        return result

    @listen(run_crew)
    def write_files(self, crew_result):
        claude_dir = Config.claude_path
        generated = crew_result.pydantic

        # Write agent file
        agents_dir = claude_dir / "agents"
        agents_dir.mkdir(exist_ok=True)
        agent_path = agents_dir / f"{self.state.name}.md"
        agent_path.write_text(generated.agent_md, encoding="utf-8")
        self.state.files_written.append(str(agent_path))

        # Write skill file
        skill_dir = claude_dir / "skills" / self.state.name
        skill_dir.mkdir(parents=True, exist_ok=True)
        skill_path = skill_dir / "SKILL.md"
        skill_path.write_text(generated.skill_md, encoding="utf-8")
        self.state.files_written.append(str(skill_path))

        # Write command file
        commands_dir = claude_dir / "commands"
        commands_dir.mkdir(exist_ok=True)
        # Determine command name from the generated content or use agent name
        match = re.search(r'name:\s*(\S+)', generated.command_md)
        cmd_name = match.group(1) if match else self.state.name
        command_path = commands_dir / f"{cmd_name}.md"
        command_path.write_text(generated.command_md, encoding="utf-8")
        self.state.files_written.append(str(command_path))
