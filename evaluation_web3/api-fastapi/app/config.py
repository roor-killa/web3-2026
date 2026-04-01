from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # PostgreSQL (Docker : port 15432 sur l’hôte) ou SQLite sans Docker : sqlite:///./data/certichain.db
    database_url: str = (
        "postgresql://certichain:certichain_secret@localhost:15432/certichain"
    )
    cors_origins: str = (
        "http://localhost:3000,http://localhost:3001,"
        "http://127.0.0.1:3000,http://127.0.0.1:3001"
    )


settings = Settings()
