import { cn } from "../../lib/utils";
import { Factory, Truck } from "lucide-react";
import type { DatasetType } from "../../types";

interface DatasetSelectorProps {
  value: DatasetType;
  onChange: (type: DatasetType) => void;
}

const options = [
  { id: "facility" as const, label: "Facility Telemetry", description: "Energy, emissions, water data", icon: Factory },
  { id: "supplier" as const, label: "Supply Chain", description: "Vendor compliance, materials", icon: Truck },
];

export default function DatasetSelector({ value, onChange }: DatasetSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
            value === opt.id
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <opt.icon
            className={cn(
              "w-6 h-6",
              value === opt.id ? "text-emerald-600" : "text-slate-400"
            )}
          />
          <div>
            <p className={cn(
              "text-sm font-medium",
              value === opt.id ? "text-emerald-900" : "text-slate-700"
            )}>
              {opt.label}
            </p>
            <p className="text-xs text-slate-500">{opt.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
