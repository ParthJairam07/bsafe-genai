import json

from fastapi import APIRouter, File, Request, UploadFile
from sse_starlette.sse import EventSourceResponse

from app.config import Settings
from app.core.csv_processor import parse_csv_upload, split_results
from app.core.rag_pipeline import audit_csv_rows
from app.core.watsonx_client import get_watsonx_llm

router = APIRouter()
settings = Settings()


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/upload")
async def audit_upload(request: Request, file: UploadFile = File(...)):
    """Synchronous audit: upload CSV, get full results."""
    rows = await parse_csv_upload(file)
    vector_store = request.app.state.vector_store
    llm = get_watsonx_llm(settings)

    results = []
    async for result in audit_csv_rows(rows, vector_store, llm, settings):
        results.append(result)

    compliant, flagged = split_results(results)
    total = len(results)

    return {
        "total_rows": total,
        "compliant_count": len(compliant),
        "flagged_count": len(flagged),
        "compliance_score": round(len(compliant) / total * 100, 1) if total > 0 else 0,
        "compliant_records": compliant,
        "flagged_records": flagged,
    }


@router.post("/stream")
async def audit_stream(request: Request, file: UploadFile = File(...)):
    """SSE streaming audit: sends progress events per row, then final results."""
    rows = await parse_csv_upload(file)
    vector_store = request.app.state.vector_store
    llm = get_watsonx_llm(settings)
    total = len(rows)

    async def event_generator():
        results = []
        async for result in audit_csv_rows(rows, vector_store, llm, settings):
            results.append(result)
            yield {
                "event": "progress",
                "data": json.dumps({
                    "row_index": result["_row_index"],
                    "total_rows": total,
                    "compliant": result.get("compliant", "ERROR"),
                }),
            }

        compliant, flagged = split_results(results)
        yield {
            "event": "complete",
            "data": json.dumps({
                "total_rows": total,
                "compliant_count": len(compliant),
                "flagged_count": len(flagged),
                "compliance_score": round(len(compliant) / total * 100, 1) if total > 0 else 0,
                "compliant_records": compliant,
                "flagged_records": flagged,
            }),
        }

    return EventSourceResponse(event_generator())
