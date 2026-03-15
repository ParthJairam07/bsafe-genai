import AuditPage from "../../pages/AuditPage";
import SOPSection from "../sop/SOPSection";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="h-14 border-b border-zinc-200 bg-white">
        <div className="max-w-[1120px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-zinc-900 flex items-center justify-center">
              <span className="text-[11px] font-bold text-white leading-none">b</span>
            </div>
            <span className="text-[15px] font-semibold text-zinc-900 tracking-tight">bsafe</span>
          </div>
          <span className="text-[13px] text-zinc-400 tracking-tight">ESG Compliance Auditor</span>
        </div>
      </header>

      <main className="max-w-[1120px] mx-auto px-6 pb-16">
        <AuditPage />
        <div className="mt-16"><SOPSection /></div>
        <footer className="mt-16 pt-6 border-t border-zinc-200">
          <p className="text-[12px] text-zinc-400">
            bsafe &middot; IBM watsonx.ai &middot; Llama 3.3 70B &middot; ChromaDB &middot; LangChain
          </p>
        </footer>
      </main>
    </div>
  );
}
