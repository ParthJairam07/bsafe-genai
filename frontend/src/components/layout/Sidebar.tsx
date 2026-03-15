import { cn } from "../../lib/utils";
import { BarChart3, FileText, Shield } from "lucide-react";

interface SidebarProps {
  currentPage: "audit" | "sop";
  onNavigate: (page: "audit" | "sop") => void;
}

const navItems = [
  { id: "audit" as const, label: "ESG Audit", icon: BarChart3 },
  { id: "sop" as const, label: "SOP Rules", icon: FileText },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-lg font-bold leading-tight">LuminaTech</h1>
            <p className="text-xs text-slate-400">ESG Compliance Auditor</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              currentPage === item.id
                ? "bg-emerald-600/20 text-emerald-400"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          Powered by IBM watsonx.ai
        </p>
      </div>
    </aside>
  );
}
