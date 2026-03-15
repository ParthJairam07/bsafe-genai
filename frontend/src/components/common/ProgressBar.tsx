import { cn } from "../../lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  status: "processing" | "complete" | "error";
}

export default function ProgressBar({ current, total, status }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] text-zinc-500">
          {status === "complete"
            ? "Audit complete"
            : status === "error"
              ? "Audit failed"
              : `Auditing row ${current} of ${total}`}
        </span>
        <span className="font-mono text-[14px] font-semibold text-zinc-900">{percentage}%</span>
      </div>

      <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            status === "complete"
              ? "bg-emerald-500"
              : status === "error"
                ? "bg-red-500"
                : "bg-zinc-900"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
