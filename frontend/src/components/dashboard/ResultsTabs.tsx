import { useState } from "react";
import { cn } from "../../lib/utils";
import type { AuditRecord } from "../../types";
import CompliantTable from "./CompliantTable";
import FlaggedTable from "./FlaggedTable";

interface ResultsTabsProps {
  compliantRecords: AuditRecord[];
  flaggedRecords: AuditRecord[];
}

export default function ResultsTabs({ compliantRecords, flaggedRecords }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<"compliant" | "flagged">(
    flaggedRecords.length > 0 ? "flagged" : "compliant"
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("compliant")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === "compliant"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Compliant Records
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-emerald-100 text-emerald-700">
            {compliantRecords.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("flagged")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === "flagged"
              ? "bg-white text-red-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          Flagged Records
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs rounded-full bg-red-100 text-red-700">
            {flaggedRecords.length}
          </span>
        </button>
      </div>

      {activeTab === "compliant" ? (
        compliantRecords.length > 0 ? (
          <CompliantTable data={compliantRecords} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            No compliant records found.
          </div>
        )
      ) : flaggedRecords.length > 0 ? (
        <FlaggedTable data={flaggedRecords} />
      ) : (
        <div className="bg-white border border-emerald-200 rounded-xl p-12 text-center text-emerald-600">
          All records are compliant. No flags raised.
        </div>
      )}
    </div>
  );
}
