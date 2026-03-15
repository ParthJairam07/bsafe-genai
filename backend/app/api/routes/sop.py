from pathlib import Path

from fastapi import APIRouter, File, Request, UploadFile

from app.config import Settings
from app.utils.sop_loader import load_sop_documents

router = APIRouter()
settings = Settings()


@router.get("/documents")
async def get_sop_documents():
    """Return raw contents of all SOP files."""
    data_path = Path(settings.DATA_DIR)
    documents = []

    for txt_file in sorted(data_path.glob("ESRS_*.txt")):
        documents.append({
            "source": txt_file.name,
            "content": txt_file.read_text(encoding="utf-8"),
            "doc_type": "sop",
        })

    anomaly_file = data_path / "Anomaly_Key_Master.csv"
    if anomaly_file.exists():
        documents.append({
            "source": anomaly_file.name,
            "content": anomaly_file.read_text(encoding="utf-8"),
            "doc_type": "rule_key",
        })

    return {"documents": documents}


@router.get("/rules")
async def get_sop_rules(request: Request):
    """Return the chunked SOP rules from the vector store."""
    vector_store = request.app.state.vector_store
    collection = vector_store._collection
    result = collection.get(include=["documents", "metadatas"])

    rules = []
    for doc, meta in zip(result["documents"], result["metadatas"]):
        rules.append({
            "content": doc,
            "source": meta.get("source", "unknown"),
            "doc_type": meta.get("doc_type", "unknown"),
        })

    return {"rules": rules}


@router.post("/upload")
async def upload_sop(request: Request, file: UploadFile = File(...)):
    """Upload a new SOP text file and add it to the vector store."""
    content = await file.read()
    text = content.decode("utf-8")

    # Save to Data directory
    data_path = Path(settings.DATA_DIR)
    file_path = data_path / file.filename
    file_path.write_text(text, encoding="utf-8")

    # Re-embed all SOPs into the vector store
    from app.core.vector_store import init_vector_store
    import chromadb

    # Clear existing collection and re-initialize
    client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
    client.delete_collection(settings.CHROMA_COLLECTION_NAME)

    vector_store = init_vector_store(settings)
    request.app.state.vector_store = vector_store

    return {"message": f"SOP '{file.filename}' uploaded and indexed successfully."}
