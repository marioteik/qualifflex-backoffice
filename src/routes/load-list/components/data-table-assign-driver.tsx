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
import type { Dispatch, SetStateAction } from "react";
import { useRoutes, useUpdateRoutes } from "@/api/routes";
import { type InsertRoute, insertRoutesSchema } from "@/schemas/routes";
import type { SelectShipment } from "@/schemas/shipments";
import { queryClient } from "@/query-client";
import queryKeyFactory from "@/lib/utils/query-key";

interface DataTableAssignDriver<TData> {
  table: Table<TData>;
  rowSelection?: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

export function DataTableAssignDriver<TData>({
  table,
  rowSelection,
  setRowSelection,
}: DataTableAssignDriver<TData>) {
  const { mutate, isPending } = useUpdateRoutes();
  const { data: drivers } = useRoutes();

  const handleSelect = (
    driver: Partial<{
      id: string;
      name: string;
      email: string;
      phone: string;
    }> = { id: undefined }
  ) => {
    try {
      const data = table.getSelectedRowModel().rows.map((row) => {
        const shipment = row.original as SelectShipment;

        const updatedRow: InsertRoute = {
          driverId: driver.id!,
          recipientId: shipment.recipient.id,
          locationId: shipment.recipient.location.id,
          shipmentId: shipment.id,
        };

        const result = insertRoutesSchema.safeParse(updatedRow);

        if (!result.success) {
          throw result.error.errors;
        }

        return result.data;
      });

      mutate(data, {
        onSuccess() {
          setRowSelection({});
          queryClient.invalidateQueries({
            queryKey: queryKeyFactory.routes(),
          });
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
          className=" hidden h-8 lg:flex"
          disabled={
            !(rowSelection && Object.keys(rowSelection).length > 0) || isPending
          }
        >
          <RefreshCcw />
          Atribuir Motorista
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[170px]">
        <DropdownMenuLabel>
          Selecionados {rowSelection && Object.keys(rowSelection).length}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {drivers.map((item) => {
          return (
            <DropdownMenuItem
              key={item.driver?.id}
              className="capitalize"
              onClick={() => handleSelect(item.driver)}
            >
              {item.driver?.name}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem className="capitalize" onClick={() => handleSelect()}>
          Remover motorista
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
