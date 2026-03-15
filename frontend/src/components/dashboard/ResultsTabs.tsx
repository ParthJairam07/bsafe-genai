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
      <div className="flex items-center gap-1 border-b border-zinc-200">
        <button
          onClick={() => setActiveTab("compliant")}
          className={cn(
            "relative px-3 pb-2.5 text-[13px] font-medium transition-colors",
            activeTab === "compliant"
              ? "text-zinc-900"
              : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          Compliant
          <span className="ml-1.5 font-mono text-[12px]">{compliantRecords.length}</span>
          {activeTab === "compliant" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("flagged")}
          className={cn(
            "relative px-3 pb-2.5 text-[13px] font-medium transition-colors",
            activeTab === "flagged"
              ? "text-zinc-900"
              : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          Flagged
          <span className={cn(
            "ml-1.5 font-mono text-[12px]",
            activeTab === "flagged" && flaggedRecords.length > 0 ? "text-red-500" : ""
          )}>{flaggedRecords.length}</span>
          {activeTab === "flagged" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-full" />
          )}
        </button>
      </div>

      {activeTab === "compliant" ? (
        compliantRecords.length > 0 ? (
          <CompliantTable data={compliantRecords} />
        ) : (
          <div className="border border-zinc-200 rounded-lg bg-white p-12 text-center text-[13px] text-zinc-400">
            No compliant records.
          </div>
        )
      ) : flaggedRecords.length > 0 ? (
        <FlaggedTable data={flaggedRecords} />
      ) : (
        <div className="border border-emerald-200 rounded-lg bg-emerald-50 p-12 text-center text-[13px] text-emerald-700">
          All records passed compliance checks.
        </div>
      )}
    </div>
  );
}
