import { useState, useEffect } from "react";
import { Upload, ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import type { SOPDocument } from "../../types";
import { fetchSOPDocuments, uploadSOP } from "../../api/auditApi";

export default function SOPSection() {
  const [documents, setDocuments] = useState<SOPDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await fetchSOPDocuments();
      setDocuments(docs);
    } catch {
      setError("Failed to load SOP documents. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDocuments(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadSOP(file);
      await loadDocuments();
    } catch {
      setError("Failed to upload SOP file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-zinc-900 tracking-tight">SOPs</h2>
          <p className="text-[13px] text-zinc-400 mt-0.5">ESG procedures used by the audit engine.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadDocuments}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-zinc-600 border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md cursor-pointer transition-colors">
            <Upload className="w-3 h-3" />
            {uploading ? "Uploading..." : "Upload"}
            <input
              type="file"
              accept=".txt"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 border border-zinc-200 rounded-lg bg-white divide-y divide-zinc-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[13px] text-zinc-400">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-zinc-400">No SOP documents found.</div>
        ) : (
          documents.map((doc) => (
            <div key={doc.source}>
              <button
                onClick={() => setExpanded(expanded === doc.source ? null : doc.source)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 transition-colors"
              >
                {expanded === doc.source ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-zinc-900 truncate">{doc.source}</p>
                  <p className="text-[11px] text-zinc-400">
                    {doc.doc_type === "sop" ? "Standard Operating Procedure" : "Rule Key Master"}
                  </p>
                </div>
              </button>
              {expanded === doc.source && (
                <pre className="px-4 pb-4 ml-7 text-[12px] text-zinc-600 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {doc.content}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
