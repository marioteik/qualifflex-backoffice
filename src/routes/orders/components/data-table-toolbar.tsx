import { Table, type RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DataTableViewOptions } from "@/components/atoms/data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export function DataTableToolbar<TData>({
  table,
  rowSelection,
  setRowSelection,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 inline-flex items-center space-x-2">
        {/* If you want a filter for codeReference or createdAt, you can implement it here */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X />
          </Button>
        )}
      </div>
      <div className="inline-flex gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
