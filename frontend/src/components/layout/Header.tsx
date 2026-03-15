export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Environmental Compliance Dashboard
          </h2>
          <p className="text-sm text-slate-500">
            RAG-powered audit of facility telemetry and supply chain data
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          System Online
        </div>
      </div>
    </header>
  );
}
