import { Table, type RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "@/components/atoms/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/atoms/data-table-view-options";
// import your product store or product data
import { productCategories } from "../data/data";
import type { Dispatch, SetStateAction } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

export function DataTableToolbar<TData>({
  table,
  rowSelection,
  setRowSelection,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Example filter for "category" if your Product has a "category" accessorKey:
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/*{table.getColumn("category") && (*/}
        {/*  <DataTableFacetedFilter*/}
        {/*    column={table.getColumn("category")}*/}
        {/*    title="Categoria"*/}
        {/*    options={productCategories.map((cat) => ({*/}
        {/*      label: cat,*/}
        {/*      value: cat,*/}
        {/*    }))}*/}
        {/*  />*/}
        {/*)}*/}

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
