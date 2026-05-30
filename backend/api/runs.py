from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services import db

router = APIRouter()


class LogRunRequest(BaseModel):
    agent_name: str
    triggered_by: str | None = None
    input_summary: str | None = None


class FinishRunRequest(BaseModel):
    status: str  # success | error
    output_summary: str | None = None
    error_msg: str | None = None


class RunResponse(BaseModel):
    id: str
    agent_name: str
    triggered_by: str | None
    status: str
    input_summary: str | None
    output_summary: str | None
    error_msg: str | None
    started_at: str
    finished_at: str | None
    duration_ms: int | None


class RunListResponse(BaseModel):
    runs: list[RunResponse]
    total: int


@router.post("/", response_model=RunResponse)
def log_run(body: LogRunRequest):
    run_id = db.log_run(body.agent_name, body.triggered_by, body.input_summary)
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=500, detail="Failed to create run")
    return RunResponse(**run)


@router.patch("/{run_id}", response_model=RunResponse)
def finish_run(run_id: str, body: FinishRunRequest):
    if not db.get_run(run_id):
        raise HTTPException(status_code=404, detail="Run not found")
    db.finish_run(run_id, body.status, body.output_summary, body.error_msg)
    return RunResponse(**db.get_run(run_id))


@router.get("/", response_model=RunListResponse)
def list_runs(agent_name: str | None = None, limit: int = 50):
    runs = db.get_runs(agent_name=agent_name, limit=min(limit, 200))
    return RunListResponse(runs=[RunResponse(**r) for r in runs], total=len(runs))


@router.get("/{run_id}", response_model=RunResponse)
def get_run(run_id: str):
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return RunResponse(**run)
