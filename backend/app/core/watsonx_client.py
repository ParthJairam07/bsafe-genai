from langchain_ibm import WatsonxLLM

from app.config import Settings


def get_watsonx_llm(settings: Settings) -> WatsonxLLM:
    """Create a deterministic Llama 3.3 70B instance via watsonx.ai."""
    return WatsonxLLM(
        model_id=settings.LLM_MODEL_ID,
        url=settings.WATSONX_URL,
        apikey=settings.WATSONX_API_KEY,
        project_id=settings.WATSONX_PROJECT_ID,
        params={
            "max_new_tokens": settings.LLM_MAX_NEW_TOKENS,
            "temperature": settings.LLM_TEMPERATURE,
            "decoding_method": "greedy",
            "repetition_penalty": 1.1,
        },
    )
