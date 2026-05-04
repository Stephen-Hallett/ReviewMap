from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.router import addresses, locations
from app.utils.db import create_db_and_tables

DESCRIPTION = """
A location-based review map for coffee shops and more.

## Postman

Import the full API into Postman via **File → Import → Link** using:

```
{server}/openapi.json
```

## Endpoints

- **`/address`** — Create and list geographic coordinates
- **`/location`** — Create, retrieve, and rate locations; upload cover images
"""


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    await create_db_and_tables()
    yield


app = FastAPI(
    title="ReviewMap API",
    description=DESCRIPTION,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    debug=settings.debug,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(addresses.router, prefix="/address", tags=["addresses"])
app.include_router(locations.router, prefix="/location", tags=["locations"])


@app.get("/", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "healthy", "message": "server is alive!"}
