import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function FileUploadZone({ onFileSelect, disabled }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file.");
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRunAudit = useCallback(() => {
    if (selectedFile) onFileSelect(selectedFile);
  }, [selectedFile, onFileSelect]);

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          "border border-dashed rounded-md px-6 py-8 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-zinc-900 bg-zinc-50"
            : "border-zinc-300 hover:border-zinc-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="space-y-1">
            <FileSpreadsheet className="w-5 h-5 text-zinc-900 mx-auto" />
            <p className="text-[14px] font-medium text-zinc-900">{selectedFile.name}</p>
            <p className="text-[12px] text-zinc-400">
              {(selectedFile.size / 1024).toFixed(1)} KB &middot; Click to change
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <Upload className="w-5 h-5 text-zinc-400 mx-auto" />
            <p className="text-[14px] font-medium text-zinc-600">Drop CSV here or click to browse</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          onClick={handleRunAudit}
          disabled={disabled}
          className={cn(
            "w-full py-2.5 rounded-md text-[13px] font-semibold text-white flex items-center justify-center gap-1.5 transition-colors",
            disabled
              ? "bg-zinc-300 cursor-not-allowed"
              : "bg-zinc-900 hover:bg-zinc-800"
          )}
        >
          Run Audit
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
