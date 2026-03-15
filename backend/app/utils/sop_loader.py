from pathlib import Path

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


def load_sop_documents(data_dir: str) -> list[Document]:
    """Read SOP text files and Anomaly Key Master, chunk for embedding."""
    docs: list[Document] = []
    data_path = Path(data_dir)

    # Load ESRS SOP text files
    for txt_file in sorted(data_path.glob("ESRS_*.txt")):
        content = txt_file.read_text(encoding="utf-8")
        docs.append(Document(
            page_content=content,
            metadata={"source": txt_file.name, "doc_type": "sop"},
        ))

    # Load Anomaly Key Master (structured rule definitions)
    anomaly_file = data_path / "Anomaly_Key_Master.csv"
    if anomaly_file.exists():
        content = anomaly_file.read_text(encoding="utf-8")
        docs.append(Document(
            page_content=content,
            metadata={"source": anomaly_file.name, "doc_type": "rule_key"},
        ))

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )
    return splitter.split_documents(docs)
