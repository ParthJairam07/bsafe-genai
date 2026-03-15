import { useState, useEffect } from "react";
import { Upload, FileText, RefreshCw } from "lucide-react";
import type { SOPDocument } from "../types";
import { fetchSOPDocuments, uploadSOP } from "../api/auditApi";

export default function SOPPage() {
  const [documents, setDocuments] = useState<SOPDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await fetchSOPDocuments();
      setDocuments(docs);
    } catch (err) {
      setError("Failed to load SOP documents. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

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
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Compliance SOPs</h3>
          <p className="text-sm text-slate-500">
            View and manage the ESG Standard Operating Procedures used by the audit engine.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadDocuments}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 cursor-pointer">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload SOP"}
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Loading SOP documents...
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          No SOP documents found.
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.source}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
                <FileText className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{doc.source}</p>
                  <p className="text-xs text-slate-500">
                    Type: {doc.doc_type === "sop" ? "Standard Operating Procedure" : "Rule Key Master"}
                  </p>
                </div>
              </div>
              <pre className="px-6 py-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                {doc.content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
