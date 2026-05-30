from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import agents, skills, commands, pipelines, stats

app = FastAPI(title="Jarvis Dashboard API", version="1.0.0")

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


@app.get("/")
def root():
    return {"status": "ok", "message": "Jarvis Dashboard API"}
