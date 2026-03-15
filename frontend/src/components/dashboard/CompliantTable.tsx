import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { AuditRecord } from "../../types";
import DataTable from "../common/DataTable";

interface CompliantTableProps {
  data: AuditRecord[];
}

const HIDDEN_COLS = ["compliant", "rule_id", "reason", "_row_index"];

export default function CompliantTable({ data }: CompliantTableProps) {
  const columns = useMemo<ColumnDef<AuditRecord, unknown>[]>(() => {
    if (data.length === 0) return [];

    const keys = Object.keys(data[0]).filter((k) => !HIDDEN_COLS.includes(k));

    const dataCols: ColumnDef<AuditRecord, unknown>[] = keys.map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => String(info.getValue() ?? ""),
    }));

    const statusCol: ColumnDef<AuditRecord, unknown> = {
      id: "status",
      header: "Status",
      cell: () => (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-medium text-emerald-700 font-sans">Pass</span>
        </div>
      ),
    };

    return [statusCol, ...dataCols];
  }, [data]);

  return <DataTable data={data} columns={columns} />;
}
