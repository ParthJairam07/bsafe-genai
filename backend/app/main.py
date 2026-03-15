from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import Settings
from app.core.vector_store import init_vector_store
from app.api.routes import audit, sop

settings = Settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize vector store with SOPs
    vector_store = init_vector_store(settings)
    app.state.vector_store = vector_store
    yield


app = FastAPI(
    title="LuminaTech ESG Compliance Auditor",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit.router, prefix="/audit", tags=["Audit"])
app.include_router(sop.router, prefix="/sop", tags=["SOP Management"])
