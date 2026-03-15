interface ComplianceChartProps {
  compliantCount: number;
  flaggedCount: number;
}

export default function ComplianceChart({ compliantCount, flaggedCount }: ComplianceChartProps) {
  const total = compliantCount + flaggedCount;
  const compliantPct = total > 0 ? (compliantCount / total) * 100 : 0;
  const flaggedPct = total > 0 ? (flaggedCount / total) * 100 : 0;

  return (
    <div className="border border-zinc-200 rounded-lg bg-white p-5">
      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.06em]">
        Compliance Distribution
      </p>

      <div className="mt-4 flex h-2.5 rounded-full overflow-hidden bg-zinc-100">
        {compliantPct > 0 && (
          <div
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${compliantPct}%` }}
          />
        )}
        {flaggedPct > 0 && (
          <div
            className="bg-red-400 transition-all duration-500"
            style={{ width: `${flaggedPct}%` }}
          />
        )}
      </div>

      <div className="mt-3 flex items-center gap-5 text-[13px]">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-600">
            Compliant <span className="font-mono font-medium text-zinc-900">{compliantCount}</span>
            <span className="text-zinc-400 ml-1">({compliantPct.toFixed(1)}%)</span>
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-zinc-600">
            Flagged <span className="font-mono font-medium text-zinc-900">{flaggedCount}</span>
            <span className="text-zinc-400 ml-1">({flaggedPct.toFixed(1)}%)</span>
          </span>
        </span>
      </div>
    </div>
  );
}
