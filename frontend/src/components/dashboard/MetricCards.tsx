import { cn } from "../../lib/utils";

interface MetricCardsProps {
  totalRows: number;
  flaggedCount: number;
  complianceScore: number;
}

export default function MetricCards({ totalRows, flaggedCount, complianceScore }: MetricCardsProps) {
  const compliantCount = totalRows - flaggedCount;

  return (
    <div className="grid grid-cols-4 border border-zinc-200 rounded-lg bg-white divide-x divide-zinc-200">
      <div className="px-5 py-4">
        <p className="font-mono text-[26px] font-semibold text-zinc-900 leading-none">{totalRows}</p>
        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.06em] mt-2">Total Rows</p>
      </div>
      <div className="px-5 py-4">
        <p className="font-mono text-[26px] font-semibold text-zinc-900 leading-none">{compliantCount}</p>
        <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-[0.06em] mt-2">Compliant</p>
      </div>
      <div className="px-5 py-4">
        <p className={cn(
          "font-mono text-[26px] font-semibold leading-none",
          flaggedCount > 0 ? "text-red-600" : "text-zinc-900"
        )}>{flaggedCount}</p>
        <p className={cn(
          "text-[11px] font-medium uppercase tracking-[0.06em] mt-2",
          flaggedCount > 0 ? "text-red-500" : "text-zinc-400"
        )}>Flagged</p>
      </div>
      <div className="px-5 py-4">
        <p className={cn(
          "font-mono text-[26px] font-semibold leading-none",
          complianceScore >= 90 ? "text-emerald-600" : complianceScore >= 70 ? "text-amber-600" : "text-red-600"
        )}>{complianceScore}%</p>
        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.06em] mt-2">Score</p>
      </div>
    </div>
  );
}
