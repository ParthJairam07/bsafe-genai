import { cn } from "../../lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  status: "processing" | "complete" | "error";
}

export default function ProgressBar({ current, total, status }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          {status === "complete"
            ? "Audit complete"
            : status === "error"
              ? "Audit failed"
              : `Auditing row ${current} of ${total}...`}
        </span>
        <span className="text-sm font-bold text-slate-900">{percentage}%</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            status === "complete"
              ? "bg-emerald-500"
              : status === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
