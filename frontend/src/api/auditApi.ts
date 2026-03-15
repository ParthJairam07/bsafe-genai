import type { AuditResponse, ProgressEvent, SOPDocument } from "../types";

export function streamAudit(
  file: File,
  onProgress: (event: ProgressEvent) => void,
  onComplete: (result: AuditResponse) => void,
  onError: (error: Error) => void
): AbortController {
  const controller = new AbortController();
  const formData = new FormData();
  formData.append("file", file);

  fetch("/audit/stream", {
    method: "POST",
    body: formData,
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Audit failed: ${response.status} ${response.statusText}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";
        for (const line of lines) {
          if (line.startsWith("event:")) {
            currentEvent = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            const data = line.slice(5).trim();
            if (!data) continue;

            try {
              const parsed = JSON.parse(data);
              if (currentEvent === "progress") {
                onProgress(parsed as ProgressEvent);
              } else if (currentEvent === "complete") {
                onComplete(parsed as AuditResponse);
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        onError(err);
      }
    });

  return controller;
}

export async function uploadForAudit(file: File): Promise<AuditResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/audit/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Audit failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchSOPDocuments(): Promise<SOPDocument[]> {
  const response = await fetch("/sop/documents");
  if (!response.ok) throw new Error("Failed to fetch SOP documents");
  const data = await response.json();
  return data.documents;
}

export async function uploadSOP(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/sop/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload SOP");
}
