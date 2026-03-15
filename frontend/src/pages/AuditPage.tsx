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
    <div>
      {/* Upload */}
      {(state.status === "idle" || state.status === "error") && (
        <div className="pt-10">
          <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">
            Compliance Audit
          </h1>
          <p className="text-[14px] text-zinc-500 mt-1.5 max-w-lg">
            Upload CSV telemetry and validate each row against ESG standard operating procedures.
          </p>

          <div className="mt-8 border border-zinc-200 rounded-lg bg-white">
            <div className="p-6">
              <DatasetSelector value={datasetType} onChange={setDatasetType} />
            </div>
            <div className="border-t border-zinc-100 p-6">
              <FileUploadZone onFileSelect={startAudit} />
            </div>
          </div>

          {state.status === "error" && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {state.error}
            </div>
          )}
        </div>
      )}

      {/* Processing */}
      {state.status === "processing" && state.progress && (
        <div className="pt-10">
          <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">
            Auditing...
          </h1>
          <div className="mt-6 border border-zinc-200 rounded-lg bg-white p-6">
            <ProgressBar
              current={state.progress.current}
              total={state.progress.total}
              status="processing"
            />
          </div>
        </div>
      )}

      {/* Results */}
      {state.status === "complete" && state.result && (
        <div className="pt-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">
                Audit Results
              </h1>
              <p className="text-[13px] text-zinc-400 mt-0.5">
                {datasetType === "facility" ? "Facility Telemetry" : "Supply Chain"} &middot; {state.result.total_rows} rows audited
              </p>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-zinc-600 border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
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
