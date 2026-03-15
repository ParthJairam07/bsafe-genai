import { useState, useCallback, useRef } from "react";
import type { AuditResponse, ProgressEvent } from "../types";
import { streamAudit } from "../api/auditApi";

type AuditStatus = "idle" | "uploading" | "processing" | "complete" | "error";

interface AuditState {
  status: AuditStatus;
  progress: { current: number; total: number } | null;
  result: AuditResponse | null;
  error: string | null;
}

export function useAudit() {
  const [state, setState] = useState<AuditState>({
    status: "idle",
    progress: null,
    result: null,
    error: null,
  });

  const controllerRef = useRef<AbortController | null>(null);

  const startAudit = useCallback((file: File) => {
    setState({
      status: "processing",
      progress: { current: 0, total: 0 },
      result: null,
      error: null,
    });

    const controller = streamAudit(
      file,
      (event: ProgressEvent) => {
        setState((prev) => ({
          ...prev,
          progress: {
            current: event.row_index + 1,
            total: event.total_rows,
          },
        }));
      },
      (result: AuditResponse) => {
        setState({
          status: "complete",
          progress: null,
          result,
          error: null,
        });
      },
      (error: Error) => {
        setState({
          status: "error",
          progress: null,
          result: null,
          error: error.message,
        });
      }
    );

    controllerRef.current = controller;
  }, []);

  const reset = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setState({
      status: "idle",
      progress: null,
      result: null,
      error: null,
    });
  }, []);

  return { state, startAudit, reset };
}
