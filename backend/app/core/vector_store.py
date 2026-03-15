import chromadb
from langchain_ibm import WatsonxEmbeddings
from langchain_community.vectorstores import Chroma

from app.config import Settings
from app.utils.sop_loader import load_sop_documents


def init_vector_store(settings: Settings) -> Chroma:
    """Initialize ChromaDB with SOP embeddings. Embeds on first run only."""
    embeddings = WatsonxEmbeddings(
        model_id=settings.EMBEDDING_MODEL_ID,
        url=settings.WATSONX_URL,
        apikey=settings.WATSONX_API_KEY,
        project_id=settings.WATSONX_PROJECT_ID,
    )

    client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
    existing = client.get_or_create_collection(settings.CHROMA_COLLECTION_NAME)

    if existing.count() == 0:
        docs = load_sop_documents(settings.DATA_DIR)
        vector_store = Chroma.from_documents(
            documents=docs,
            embedding=embeddings,
            collection_name=settings.CHROMA_COLLECTION_NAME,
            persist_directory=settings.CHROMA_PERSIST_DIR,
        )
    else:
        vector_store = Chroma(
            collection_name=settings.CHROMA_COLLECTION_NAME,
            embedding_function=embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIR,
        )

    return vector_store
