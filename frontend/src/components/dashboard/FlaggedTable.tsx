import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { AuditRecord } from "../../types";
import DataTable from "../common/DataTable";

interface FlaggedTableProps {
  data: AuditRecord[];
}

const HIDDEN_COLS = ["compliant", "_row_index"];

export default function FlaggedTable({ data }: FlaggedTableProps) {
  const columns = useMemo<ColumnDef<AuditRecord, unknown>[]>(() => {
    if (data.length === 0) return [];

    const keys = Object.keys(data[0]).filter(
      (k) => !HIDDEN_COLS.includes(k) && k !== "rule_id" && k !== "reason"
    );

    const statusCol: ColumnDef<AuditRecord, unknown> = {
      id: "status",
      header: "Status",
      cell: (info) => {
        const compliant = info.row.original.compliant;
        const isError = compliant === "ERROR";
        return (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className={`w-4 h-4 ${isError ? "text-amber-500" : "text-red-500"}`} />
            <span className={`text-xs font-medium ${isError ? "text-amber-600" : "text-red-600"}`}>
              {isError ? "Error" : "Violation"}
            </span>
          </div>
        );
      },
    };

    const ruleCol: ColumnDef<AuditRecord, unknown> = {
      accessorKey: "rule_id",
      header: "Rule ID",
      cell: (info) => {
        const val = String(info.getValue() ?? "");
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
            {val}
          </span>
        );
      },
    };

    const dataCols: ColumnDef<AuditRecord, unknown>[] = keys.map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => String(info.getValue() ?? ""),
    }));

    const reasonCol: ColumnDef<AuditRecord, unknown> = {
      accessorKey: "reason",
      header: "Reason",
      cell: (info) => (
        <div className="max-w-xs text-xs text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          {String(info.getValue() ?? "")}
        </div>
      ),
    };

    return [statusCol, ruleCol, ...dataCols, reasonCol];
  }, [data]);

  return (
    <DataTable
      data={data}
      columns={columns}
      rowClassName={() => "bg-red-50/30"}
    />
  );
}
