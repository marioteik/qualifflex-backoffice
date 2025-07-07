import { Table, type RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DataTableViewOptions } from "@/components/atoms/data-table-view-options";
import type { Dispatch, SetStateAction } from "react";
import { DebouncedInput } from "@/components/atoms/debounced-input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const nameSearch = table.getColumn("code")?.getFilterValue();

  // Example filter for "category" if your Product has a "category" accessorKey:
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DebouncedInput
          value={nameSearch as string}
          className="md:text-sm h-8 w-[260px]"
          debounce={200}
          onChange={(value) => {
            table.getColumn("code")?.setFilterValue(value);
          }}
          placeholder="Código de referência e descrição"
        />

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
        {/* Any custom button or driver actions here */}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
