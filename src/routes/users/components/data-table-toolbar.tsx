import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roles, status } from "@/routes/users/data/data";
import { DataTableFacetedFilter } from "@/components/atoms/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/atoms/data-table-view-options";
import { useUsersStore } from "@/routes/users/data/store";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  row?: TData;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const setIsEditOpen = useUsersStore((state) => state.setIsEditOpen);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar email ou celular..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("roleName") && (
          <DataTableFacetedFilter
            column={table.getColumn("roleName")}
            title="Papéis"
            options={roles}
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
        <DataTableViewOptions table={table} />

        <div className="inline-flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => setIsEditOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Usuário
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
