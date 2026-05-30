FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
RUN pip install uv --quiet
COPY backend/pyproject.toml backend/uv.lock backend/
RUN cd backend && uv sync --no-dev --frozen
COPY backend/ ./backend/
EXPOSE 8000
CMD ["/app/backend/.venv/bin/uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
