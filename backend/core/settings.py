from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv


load_dotenv()


class Config(BaseSettings):

    model_config = SettingsConfigDict(env_file_encoding='utf-8', extra='ignore', env_ignore_empty=True)

    OPENAI_API_KEY: str  = Field(...)
    OPENAI_MODEL:   str  = Field(...)
    API_VERSION:    str  = Field(...)
    APP_ENV:        str  = Field(...)
    AGENT_VERBOSE:  bool = Field(...)
    LOGFIRE_TOKEN:  str  = Field(default="")

    CLAUDE_API_KEY: str = Field(default="")
    CLAUDE_DIR:     str = Field(default="")

    @property
    def claude_path(self) -> Path:
        if self.CLAUDE_DIR:
            return Path(self.CLAUDE_DIR)
        return Path(__file__).parent.parent.parent / ".claude"


Config = Config()
