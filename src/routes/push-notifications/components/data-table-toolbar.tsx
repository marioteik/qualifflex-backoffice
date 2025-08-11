import React from "react";
import { Table } from "@tanstack/react-table";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/atoms/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/atoms/data-table-view-options";
import { DebouncedInput } from "@/components/atoms/debounced-input";
import { recipientTypes, notificationStatuses } from "../data/data";
import { NotificationFormDialog } from "./notification-form-dialog";
import type { PushNotification } from "@/schemas/push-notifications";

interface DataTableToolbarProps {
  table: Table<PushNotification>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;
  const titleSearch = table.getColumn("title")?.getFilterValue();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DebouncedInput
          value={titleSearch as string}
          className="md:text-sm h-8 w-[300px]"
          debounce={200}
          onChange={(value) => {
            table.getColumn("title")?.setFilterValue(value);
          }}
          placeholder="Buscar por título..."
        />

        {table.getColumn("recipientType") && (
          <DataTableFacetedFilter
            column={table.getColumn("recipientType")}
            title="Destinatários"
            options={recipientTypes}
          />
        )}

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={notificationStatuses}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Send className="h-4 w-4" />
          Enviar Notificação
        </Button>
      </div>

      <NotificationFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}