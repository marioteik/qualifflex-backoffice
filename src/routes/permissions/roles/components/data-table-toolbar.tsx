import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import RoleForm from "./role-form";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  row?: TData;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar papéis..."
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("role")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <div className="inline-flex items-center gap-2">
        <Button size="sm" className="h-8 gap-1" onClick={() => setOpened(true)}>
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Papel
          </span>
        </Button>
      </div>

      <RoleForm setOpened={setOpened} opened={opened} />
    </div>
  );
}
