import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/atoms/data-table-column-header";
import { formatDateTime } from "@/lib/utils/formatters";
import type { PushNotification } from "@/schemas/push-notifications";
import { recipientTypes, notificationStatuses } from "../data/data";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<PushNotification>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar item"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "body",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mensagem" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate">
            {row.getValue("body")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "recipientType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destinatários" />
    ),
    cell: ({ row }) => {
      const recipientType = recipientTypes.find(
        (type) => type.value === row.getValue("recipientType")
      );

      if (!recipientType) {
        return null;
      }

      return (
        <Badge variant="outline" className="gap-1">
          <recipientType.icon className="h-3 w-3" />
          {recipientType.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = notificationStatuses.find(
        (s) => s.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <Badge 
          variant={status.variant}
          className={status.variant === "success" ? "bg-green-500" : ""}
        >
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "results",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resultados" />
    ),
    cell: ({ row }) => {
      const notification = row.original;
      return (
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            {notification.successCount}
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="h-3 w-3" />
            {notification.failureCount}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "sentAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enviado em" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDateTime(row.getValue("sentAt"))}
        </div>
      );
    },
  },
  {
    id: "sender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enviado por" />
    ),
    cell: ({ row }) => {
      const sender = row.original.sender;
      return (
        <span className="max-w-[150px] truncate">
          {sender?.name || sender?.email || "Sistema"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];