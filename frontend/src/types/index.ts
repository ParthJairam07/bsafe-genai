export interface AuditRecord {
  [key: string]: string | number | boolean;
  compliant: string;
  rule_id: string;
  reason: string;
}

export interface AuditResponse {
  total_rows: number;
  compliant_count: number;
  flagged_count: number;
  compliance_score: number;
  compliant_records: AuditRecord[];
  flagged_records: AuditRecord[];
}

export interface ProgressEvent {
  row_index: number;
  total_rows: number;
  compliant: string;
}

export type DatasetType = "facility" | "supplier";

export interface SOPDocument {
  source: string;
  content: string;
  doc_type: string;
}
