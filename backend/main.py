from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import agents, skills, commands, pipelines, stats, runs
from backend.services import db as db_service
from backend.services.git_sync import git_pull, get_last_synced
from backend.core.settings import Config


@asynccontextmanager
async def lifespan(app: FastAPI):
    db_service.init_db()
    yield


app = FastAPI(title="Jarvis Dashboard API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router,    prefix="/api/v1/agents",    tags=["agents"])
app.include_router(skills.router,    prefix="/api/v1/skills",    tags=["skills"])
app.include_router(commands.router,  prefix="/api/v1/commands",  tags=["commands"])
app.include_router(pipelines.router, prefix="/api/v1/pipelines", tags=["pipelines"])
app.include_router(stats.router,     prefix="/api/v1/stats",     tags=["stats"])
app.include_router(runs.router,      prefix="/api/v1/runs",      tags=["runs"])


@app.post("/api/v1/sync")
def sync_agents():
    result = git_pull(Config.claude_path)
    return result


@app.get("/api/v1/sync/status")
def sync_status():
    return {"last_synced": get_last_synced()}


@app.get("/")
def root():
    return {"status": "ok", "message": "Jarvis Dashboard API"}
