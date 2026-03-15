import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { DatasetType } from "../types";
import { useAudit } from "../hooks/useAudit";
import FileUploadZone from "../components/upload/FileUploadZone";
import DatasetSelector from "../components/upload/DatasetSelector";
import ProgressBar from "../components/common/ProgressBar";
import MetricCards from "../components/dashboard/MetricCards";
import ComplianceChart from "../components/dashboard/ComplianceChart";
import ResultsTabs from "../components/dashboard/ResultsTabs";

export default function AuditPage() {
  const [datasetType, setDatasetType] = useState<DatasetType>("facility");
  const { state, startAudit, reset } = useAudit();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Upload Section -- shown when idle or error */}
      {(state.status === "idle" || state.status === "error") && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Upload Dataset</h3>
            <p className="text-sm text-slate-500">
              Select your dataset type and upload a CSV file to begin the ESG compliance audit.
            </p>
          </div>

          <DatasetSelector value={datasetType} onChange={setDatasetType} />
          <FileUploadZone onFileSelect={startAudit} />

          {state.status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {state.error}
            </div>
          )}
        </div>
      )}

      {/* Processing -- show progress bar */}
      {state.status === "processing" && state.progress && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Audit in Progress</h3>
          <ProgressBar
            current={state.progress.current}
            total={state.progress.total}
            status="processing"
          />
          <p className="text-sm text-slate-500 text-center">
            Each row is being evaluated against ESG compliance rules via the RAG pipeline...
          </p>
        </div>
      )}

      {/* Results Dashboard */}
      {state.status === "complete" && state.result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Audit Results</h3>
              <p className="text-sm text-slate-500">
                {datasetType === "facility" ? "Facility Telemetry" : "Supply Chain"} audit complete.
              </p>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Audit
            </button>
          </div>

          <MetricCards
            totalRows={state.result.total_rows}
            flaggedCount={state.result.flagged_count}
            complianceScore={state.result.compliance_score}
          />

          <ComplianceChart
            compliantCount={state.result.compliant_count}
            flaggedCount={state.result.flagged_count}
          />

          <ResultsTabs
            compliantRecords={state.result.compliant_records}
            flaggedRecords={state.result.flagged_records}
          />
        </div>
      )}
    </div>
  );
}
