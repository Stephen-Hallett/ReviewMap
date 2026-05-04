import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "ReviewMap API"
    cors_allow_origins: list[str] = ["*"]
    debug: bool = False
    database_url: str
    azure_storage_connection: str
    azure_storage_container: str = "assets"


print(os.environ)
settings = Settings()
