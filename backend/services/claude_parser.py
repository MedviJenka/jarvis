from pathlib import Path
import frontmatter
import re

CATEGORY_MAP = {
    "api-architect": "backend", "fastapi-reviewer": "backend",
    "supabase-database-agent": "backend", "crewai-architect": "backend",
    "crewai-reviewer": "backend",
    "github-pr-reviewer": "review", "production-readiness-reviewer": "review",
    "react-native-ui-reviewer": "review",
    "k8s-kustomize-reviewer": "infrastructure", "k8s-production-auditor": "infrastructure",
    "react-native-ui-expert": "frontend", "mapbox-navigation-ui": "frontend",
    "feature-planner": "frontend",
    "aviation-innovator": "domain", "flight-computer-engineer": "domain",
    "windman-prompt-refiner": "domain",
    "pytest-api-tester": "testing",
    "reddit-aviation-marketer": "bizdev", "linkedin-reddit-prospector": "bizdev",
}


def _short_desc(full_desc: str) -> str:
    """Extract first sentence from description, strip example blocks."""
    # Remove <example>...</example> blocks
    clean = re.sub(r'<example>.*?</example>', '', full_desc, flags=re.DOTALL)
    # Get first non-empty line
    first = clean.split('\n')[0].strip()
    if not first:
        first = clean.strip()[:200]
    return first[:200]


def parse_all_agents(claude_dir: Path) -> list[dict]:
    agents_dir = claude_dir / "agents"
    memory_dir = claude_dir / "agent-memory"
    results = []
    if not agents_dir.exists():
        return results
    for md_file in sorted(agents_dir.glob("*.md")):
        try:
            post = frontmatter.load(str(md_file))
            name = post.get("name", md_file.stem)
            desc_full = str(post.get("description", ""))
            tools_raw = post.get("tools", "")
            tools = [t.strip() for t in str(tools_raw).split(",")] if tools_raw else []
            body = post.content or ""
            results.append({
                "name": name,
                "description": _short_desc(desc_full),
                "description_full": desc_full,
                "category": CATEGORY_MAP.get(name, "domain"),
                "model": post.get("model", "sonnet"),
                "color": post.get("color", "blue"),
                "tools": tools,
                "memory_type": post.get("memory", "none"),
                "skill": post.get("skill"),
                "system_prompt_preview": body[:300],
                "linked_commands": [],
                "has_memory": (memory_dir / name).exists(),
            })
        except Exception:
            continue
    return results


def parse_all_skills(claude_dir: Path) -> list[dict]:
    skills_dir = claude_dir / "skills"
    results = []
    if not skills_dir.exists():
        return results
    for skill_dir in sorted(skills_dir.iterdir()):
        skill_md = skill_dir / "SKILL.md"
        if not skill_md.exists():
            continue
        try:
            post = frontmatter.load(str(skill_md))
            results.append({
                "name": post.get("name", skill_dir.name),
                "description": str(post.get("description", "")),
                "body": post.content or "",
            })
        except Exception:
            continue
    return results


def parse_all_commands(claude_dir: Path) -> list[dict]:
    commands_dir = claude_dir / "commands"
    results = []
    if not commands_dir.exists():
        return results
    for md_file in sorted(commands_dir.glob("*.md")):
        try:
            post = frontmatter.load(str(md_file))
            body = post.content or ""
            # detect agent refs: look for subagent_type or agent names mentioned
            agent_refs = re.findall(r'subagent_type["\s:=]+([a-z-]+)', body)
            # also look for known agent names in body
            results.append({
                "name": md_file.stem,
                "description": str(post.get("description", "")),
                "body": body,
                "agent_refs": agent_refs,
                "is_pipeline": len(agent_refs) > 1 or md_file.stem in ("fix", "ship"),
            })
        except Exception:
            continue
    return results


def build_linked_commands(agents: list[dict], commands: list[dict]) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {a["name"]: [] for a in agents}
    for cmd in commands:
        body_lower = cmd["body"].lower()
        for agent in agents:
            if agent["name"] in body_lower or (agent.get("skill") and agent["skill"] in body_lower):
                result[agent["name"]].append(cmd["name"])
    return result


def detect_pipelines(commands: list[dict], agents: list[dict]) -> list[dict]:
    # Hardcoded known pipelines
    agent_lookup = {a["name"]: a for a in agents}
    pipelines = [
        {
            "name": "fix",
            "description": "Review -> Fix -> Validate: detects bugs, fixes P0/P1, runs ruff + pytest",
            "steps": [
                {"agent_name": "github-pr-reviewer", "label": "Reviewer", "description": "Detects changed files, finds bugs and violations"},
                {"agent_name": "windman-prompt-refiner", "label": "Resolver", "description": "Fixes all P0 and P1 issues reported"},
                {"agent_name": "pytest-api-tester", "label": "Validator", "description": "Runs ruff check + pytest smoke tests"},
            ],
            "command_file": "commands/fix.md",
            "is_custom": False,
        },
        {
            "name": "ship",
            "description": "Simplify -> Scrutinize -> Validate -> Git: cleans code, quality gate, commits + PR",
            "steps": [
                {"agent_name": "react-native-ui-reviewer", "label": "Simplifier", "description": "Refines code clarity and consistency"},
                {"agent_name": "production-readiness-reviewer", "label": "Scrutinizer", "description": "9-pillar quality gate, fixes P0/P1"},
                {"agent_name": "pytest-api-tester", "label": "Validator", "description": "Runs build/typecheck/lint/tests"},
                {"agent_name": "github-pr-reviewer", "label": "Git", "description": "Commits, pushes, opens PR against main"},
            ],
            "command_file": "commands/ship.md",
            "is_custom": False,
        },
    ]
    # Hydrate steps with agent data
    for pipeline in pipelines:
        for step in pipeline["steps"]:
            step["agent"] = agent_lookup.get(step["agent_name"])
    return pipelines


def get_stats(agents, skills, commands, pipelines) -> dict:
    category_breakdown: dict[str, int] = {}
    model_breakdown: dict[str, int] = {}
    for a in agents:
        category_breakdown[a["category"]] = category_breakdown.get(a["category"], 0) + 1
        model_breakdown[a["model"]] = model_breakdown.get(a["model"], 0) + 1
    return {
        "agent_count": len(agents),
        "skill_count": len(skills),
        "command_count": len(commands),
        "pipeline_count": len(pipelines),
        "category_breakdown": category_breakdown,
        "model_breakdown": model_breakdown,
    }
