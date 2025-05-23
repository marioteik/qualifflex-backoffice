import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  Column,
  type ColumnDef,
  type RowSelectionState,
  Table,
} from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRoutes } from "@/api/routes";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface DataTableAssignDriver<TData, TValue> {
  column?: Column<TData, TValue>;
}

export function DataTableSelectDriver<TData, TValue>({
  column,
}: DataTableAssignDriver<TData, TValue>) {
  const { data: drivers } = useRoutes();
  const selectedValue = column?.getFilterValue();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-dashed hidden h-8 lg:flex focus-visible:ring-0"
        >
          <PlusCircle />
          Motorista
          {selectedValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="muted" className="rounded-sm px-1 font-normal">
                {
                  drivers.find((d) => d.driver.name === selectedValue)?.driver
                    .name
                }
              </Badge>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[170px]">
        {drivers.map((item) => {
          return (
            <DropdownMenuItem
              key={item.driver?.id}
              className="capitalize"
              onClick={() => {
                column?.setFilterValue(item.driver?.name);
              }}
            >
              {item.driver?.name}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-center inline-flex items-center justify-center w-full"
          onClick={() => column?.setFilterValue(undefined)}
        >
          Limpar Filtro
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
