from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # IBM watsonx.ai credentials
    WATSONX_API_KEY: str = ""
    WATSONX_PROJECT_ID: str = ""
    WATSONX_URL: str = "https://us-south.ml.cloud.ibm.com"

    # Model IDs
    EMBEDDING_MODEL_ID: str = "ibm/slate-125m-english-rtrvr-v2"
    LLM_MODEL_ID: str = "meta-llama/llama-3-3-70b-instruct"

    # ChromaDB
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    CHROMA_COLLECTION_NAME: str = "esg_sop_rules"

    # SOP data directory
    DATA_DIR: str = "../Data"

    # RAG parameters
    RAG_TOP_K: int = 3
    LLM_MAX_NEW_TOKENS: int = 512
    LLM_TEMPERATURE: float = 0.0

    # CORS
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}
