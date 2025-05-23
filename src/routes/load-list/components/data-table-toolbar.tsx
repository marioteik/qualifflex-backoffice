import { type RowSelectionState, Table } from "@tanstack/react-table";
import { Volleyball, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { status } from "@/routes/shipments/data/data";
import { DataTableFacetedFilter } from "@/components/atoms/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/atoms/data-table-view-options";
import { useShipments } from "@/api/shipments";
import type { Dispatch, SetStateAction } from "react";
import { DataTableSelectDriver } from "./data-table-select-driver";
import { DataTableAssignDriver } from "./data-table-assign-driver";

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
  const isFiltered = table.getState().columnFilters?.length > 0;

  const { data } = useShipments();

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={status}
          />
        )}
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

      <div className="inline-flex gap-2 justify-between items-center w-full">
        {table.getColumn("recipient") && (
          <DataTableSelectDriver column={table.getColumn("driver")} />
        )}

        <div className="inline-flex gap-2">
          <DataTableAssignDriver
            table={table}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />

          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
