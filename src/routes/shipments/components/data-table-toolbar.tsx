import { type RowSelectionState, Table } from "@tanstack/react-table";
import { Volleyball, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { status } from "@/routes/shipments/data/data";
import { DataTableFacetedFilter } from "@/components/atoms/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/atoms/data-table-view-options";
import { useShipments } from "@/api/shipments";
import { DataTableStatus } from "./data-table-status";
import type { Dispatch, SetStateAction } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  row?: TData;
  rowSelection: RowSelectionState | undefined;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

export function DataTableToolbar<TData>({
  table,
  rowSelection,
  setRowSelection,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { data } = useShipments();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("recipient") && (
          <DataTableFacetedFilter
            column={table.getColumn("recipient")}
            title="Costureira"
            options={Array.from(
              new Map(
                data.map((item) => {
                  const label =
                    item.recipient.businessInfo.tradeName ||
                    item.recipient.businessInfo.nameCorporateReason ||
                    "";

                  return [label, { label, value: label, icon: Volleyball }];
                }),
              ).values(),
            )}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={status}
          />
        )}
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
        <DataTableStatus
          table={table}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />

        <DataTableViewOptions table={table} />

        {/*<div className="inline-flex items-center gap-2">*/}
        {/*  <Button*/}
        {/*    size="sm"*/}
        {/*    className="h-8 gap-1"*/}
        {/*    onClick={() => setOpened(true)}*/}
        {/*  >*/}
        {/*    <PlusCircle className="h-3.5 w-3.5" />*/}
        {/*    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">*/}
        {/*      Add Remessa*/}
        {/*    </span>*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
