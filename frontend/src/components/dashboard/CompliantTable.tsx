import { useMemo } from "react";
import { CheckCircle } from "lucide-react";
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
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Compliant</span>
        </div>
      ),
    };

    return [statusCol, ...dataCols];
  }, [data]);

  return <DataTable data={data} columns={columns} />;
}
