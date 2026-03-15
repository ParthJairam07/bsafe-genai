import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ComplianceChartProps {
  compliantCount: number;
  flaggedCount: number;
}

const COLORS = ["#10b981", "#ef4444"];

export default function ComplianceChart({ compliantCount, flaggedCount }: ComplianceChartProps) {
  const data = [
    { name: "Compliant", value: compliantCount },
    { name: "Flagged", value: flaggedCount },
  ];

  const total = compliantCount + flaggedCount;
  const score = total > 0 ? Math.round((compliantCount / total) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-sm font-medium text-slate-500 mb-4">Compliance Breakdown</h3>
      <div className="flex items-center gap-8">
        <div className="w-40 h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                strokeWidth={2}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">{score}%</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-600">Compliant: {compliantCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-slate-600">Flagged: {flaggedCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
