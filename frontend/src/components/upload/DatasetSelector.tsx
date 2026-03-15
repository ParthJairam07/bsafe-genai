import { cn } from "../../lib/utils";
import type { DatasetType } from "../../types";

interface DatasetSelectorProps {
  value: DatasetType;
  onChange: (type: DatasetType) => void;
}

const options = [
  { id: "facility" as const, label: "Facility Telemetry" },
  { id: "supplier" as const, label: "Supply Chain" },
];

export default function DatasetSelector({ value, onChange }: DatasetSelectorProps) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.06em] mb-2.5">
        Dataset
      </p>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-colors",
              value === opt.id
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-500 hover:text-zinc-700"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
