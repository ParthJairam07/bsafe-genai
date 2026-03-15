import { useMemo } from "react";
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
        const isError = info.row.original.compliant === "ERROR";
        return (
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isError ? "bg-amber-500" : "bg-red-500"}`} />
            <span className={`text-[12px] font-medium font-sans ${isError ? "text-amber-700" : "text-red-700"}`}>
              {isError ? "Error" : "Fail"}
            </span>
          </div>
        );
      },
    };

    const ruleCol: ColumnDef<AuditRecord, unknown> = {
      accessorKey: "rule_id",
      header: "Rule",
      cell: (info) => (
        <span className="text-[12px] font-semibold text-red-600 font-sans">
          {String(info.getValue() ?? "")}
        </span>
      ),
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
        <p className="max-w-xs text-[12px] leading-relaxed text-red-800 font-sans">
          {String(info.getValue() ?? "")}
        </p>
      ),
    };

    return [statusCol, ruleCol, ...dataCols, reasonCol];
  }, [data]);

  return (
    <DataTable
      data={data}
      columns={columns}
      rowClassName={() => "!bg-red-50/50"}
    />
  );
}
