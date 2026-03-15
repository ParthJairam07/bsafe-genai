from pydantic import BaseModel


class AuditVerdict(BaseModel):
    compliant: str
    rule_id: str
    reason: str


class AuditResponse(BaseModel):
    total_rows: int
    compliant_count: int
    flagged_count: int
    compliance_score: float
    compliant_records: list[dict]
    flagged_records: list[dict]


class SOPDocument(BaseModel):
    source: str
    content: str
    doc_type: str
