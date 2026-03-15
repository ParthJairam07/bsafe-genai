import json
import re
from typing import AsyncGenerator

from langchain_community.vectorstores import Chroma
from langchain_ibm import WatsonxLLM

from app.config import Settings

AUDIT_PROMPT = """\
[INST] <<SYS>>
You are a meticulous ESG Compliance Auditor. You must catch all threshold violations.
Output ONLY a single JSON object.
<</SYS>>

TASK: Compare the DATA against the COMPLIANCE RULES.
Pay special attention to the 'water_withdrawal_m3' threshold of 10,000 and 'scope_2' being 0 when energy > 1000.

COMPLIANCE RULES:
{context}

DATA RECORD:
{row_text}

If ANY value exceeds a threshold or is missing, set "compliant": false.
JSON Output:
{{
    "compliant": true/false,
    "rule_id": "ID",
    "reason": "specific reason"
}}
[/INST]"""


def serialize_row(row: dict) -> str:
    """Convert a data row dict to a readable string for the LLM."""
    pairs = [f"{k}={v}" for k, v in row.items()]
    return "Row Data: " + ", ".join(pairs)


def parse_llm_verdict(raw: str) -> dict:
    """Extract a JSON verdict from LLM output, with fallbacks."""
    # Try direct JSON parse
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        pass

    # Fallback: extract JSON object from surrounding text
    match = re.search(r"\{[^}]+\}", raw, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    return {
        "compliant": "ERROR",
        "rule_id": "PARSE_FAIL",
        "reason": f"Could not parse LLM response: {raw[:200]}",
    }


async def audit_single_row(
    row: dict,
    vector_store: Chroma,
    llm: WatsonxLLM,
    settings: Settings,
) -> dict:
    """Audit one data row against the SOP vector store."""
    row_text = serialize_row(row)

    # Retrieve top-k SOP chunks
    docs = vector_store.similarity_search(row_text, k=settings.RAG_TOP_K)
    context = "\n---\n".join(doc.page_content for doc in docs)

    prompt = AUDIT_PROMPT.format(context=context, row_text=row_text)
    response = llm.invoke(prompt)
    verdict = parse_llm_verdict(response)

    return {**row, **verdict}


async def audit_csv_rows(
    rows: list[dict],
    vector_store: Chroma,
    llm: WatsonxLLM,
    settings: Settings,
) -> AsyncGenerator[dict, None]:
    """Audit all rows, yielding one verdict dict per row for SSE streaming."""
    for i, row in enumerate(rows):
        result = await audit_single_row(row, vector_store, llm, settings)
        result["_row_index"] = i
        yield result
