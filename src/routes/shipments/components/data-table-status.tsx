import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type RowSelectionState, Table } from "@tanstack/react-table";
import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { clearFieldsBasedOnStatus, status, statusOrder } from "../data/data";
import { type SelectShipment, selectShipmentSchema } from "@/schemas/shipments";
import { useUpdateShipment } from "@/api/shipments";
import type { Dispatch, SetStateAction } from "react";

interface DataTableStatus<TData> {
  table: Table<TData>;
  rowSelection?: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

export function DataTableStatus<TData>({
  table,
  rowSelection,
  setRowSelection,
}: DataTableStatus<TData>) {
  const { mutate } = useUpdateShipment();

  const handleSelect = (stat: (typeof statusOrder)[number]) => {
    try {
      const data = table.getSelectedRowModel().rows.map((row) => {
        const shipment = row.original as SelectShipment;

        const updatedRow = {
          ...shipment,
          status: stat,
          items: shipment.items.map(({ product, ...item }) => {
            return item;
          }),
          ...clearFieldsBasedOnStatus(stat),
        };

        const result = selectShipmentSchema.safeParse(updatedRow);

        if (!result.success) {
          throw result.error.errors;
        }

        return result.data;
      });

      mutate(data, {
        onSuccess() {
          setRowSelection({});
        },
      });
    } catch (e) {
      console.error("No call was made because of error:", e);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
          disabled={!(rowSelection && Object.keys(rowSelection).length > 0)}
        >
          <RefreshCcw />
          Alterar Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[170px]">
        <DropdownMenuLabel>
          Selecionados {rowSelection && Object.keys(rowSelection).length}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {status.map((item) => {
          return (
            <DropdownMenuItem
              key={item.value}
              className="capitalize"
              onClick={() => handleSelect(item.value)}
            >
              <item.icon className="h-4 w-4 mr-1" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
