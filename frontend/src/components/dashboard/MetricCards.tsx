import { FileCheck, AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";

interface MetricCardsProps {
  totalRows: number;
  flaggedCount: number;
  complianceScore: number;
}

export default function MetricCards({ totalRows, flaggedCount, complianceScore }: MetricCardsProps) {
  const scoreColor =
    complianceScore >= 90
      ? "text-emerald-600"
      : complianceScore >= 70
        ? "text-amber-600"
        : "text-red-600";

  const scoreBg =
    complianceScore >= 90
      ? "bg-emerald-50 border-emerald-200"
      : complianceScore >= 70
        ? "bg-amber-50 border-amber-200"
        : "bg-red-50 border-red-200";

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <FileCheck className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-500">Total Rows Audited</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">{totalRows}</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-600">Rows Flagged</span>
        </div>
        <p className="text-3xl font-bold text-red-700">{flaggedCount}</p>
      </div>

      <div className={cn("border rounded-xl p-6", scoreBg)}>
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className={cn("w-5 h-5", scoreColor)} />
          <span className={cn("text-sm", scoreColor)}>Compliance Score</span>
        </div>
        <p className={cn("text-3xl font-bold", scoreColor)}>
          {complianceScore}%
        </p>
      </div>
    </div>
  );
}
