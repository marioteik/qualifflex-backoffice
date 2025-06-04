import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { status, statusOrder } from "@/routes/shipments/data/data";
import { cn } from "@/lib/utils";
import React from "react";
import { DataTableColumnHeader } from "@/components/atoms/data-table-column-header";
import type { SelectShipment } from "@/schemas/shipments";

export const columns: (ColumnDef<SelectShipment> & { columnName?: string })[] =
  [
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
      size: 0,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "number",
      columnName: "Número",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="N.º" />
      ),
      size: 150,
      enableHiding: false,
    },
    {
      accessorKey: "recipient",
      columnName: "Costureira",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Costureira" />
      ),
      size: 1200,
      cell: ({ row }) => {
        const value =
          row.original.recipient?.businessInfo.tradeName ||
          row.original.recipient?.businessInfo.nameCorporateReason?.split(
            " "
          )[0];

        if (!value) {
          return "-";
        }

        return <div className="w-full text-left text-nowrap">{value}</div>;
      },
      enableHiding: true,
      filterFn: (row, id, value: string[]) => {
        const rowValue =
          row.original.recipient?.businessInfo.tradeName ||
          row.original.recipient?.businessInfo.nameCorporateReason;

        if (!rowValue) return false; // Return false if rowValue is null or undefined

        // Split rowValue into words
        const rowWords = rowValue.toLowerCase().split(" "); // Normalize to lowercase

        // Iterate through the value array
        return value?.some((valuePart) =>
          valuePart
            .toLowerCase()
            .split(" ") // Split each part into words
            .every((valueWord) =>
              rowWords.some((rowWord) => rowWord.includes(valueWord))
            )
        );
      },
    },
    {
      id: "driver",
      columnName: "Motorista",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Motorista" />
      ),
      cell: ({ row }) => {
        const value = row.original.driver;

        if (!value) {
          return "-";
        }

        return <div className="w-full text-left text-nowrap">{value}</div>;
      },
      filterFn: (row, id, value) => {
        return row.original.driver === value;
      },
    },
    {
      accessorKey: "status",
      columnName: "Status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row, getValue }) => {
        const value = getValue() as string;
        const stat = status.find((status) => status.value === value);

        if (!stat) {
          return "-";
        }

        return (
          <div
            className={cn(
              value === "Pendente" &&
                "bg-yellow-500/60 text-white dark:bg-yellow-400/70",
              value === "Pendente aprovação" &&
                "bg-yellow-500/80 text-white dark:bg-yellow-400/80",
              value === "Confirmado" && "bg-primary/80 text-primary-foreground",
              value === "Produzindo" &&
                "bg-warning text-warning-foreground dark:bg-warning/70",
              value === "Finalizado" &&
                "bg-success text-success-foreground  dark:bg-success/70",
              value === "Coletado" && "bg-muted text-muted-foreground",
              value === "Recusado" &&
                "bg-destructive bg-destructive-foreground",
              "flex w-full items-center p-2 rounded-full justify-center font-semibold text-xs text-center"
            )}
          >
            <div className="flex-1">
              <span>{value}</span>
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.original.status);
      },
      sortingFn: (rowA, rowB) => {
        const statusA = rowA.original.status!;
        const statusB = rowB.original.status!;

        const indexA = statusOrder.indexOf(statusA);
        const indexB = statusOrder.indexOf(statusB);

        // Ensure undefined or unmatched statuses are sorted to the end
        const validIndexA = indexA !== -1 ? indexA : statusOrder.length;
        const validIndexB = indexB !== -1 ? indexB : statusOrder.length;

        return validIndexA - validIndexB;
      },
      size: 200,
    },
    {
      accessorKey: "createdAt",
      size: 10,
      enableHiding: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Criado em" />
      ),
      cell: ({ row }) => {
        const date = row.original.createdAt
          ? new Date(row.original.createdAt)
          : null;
        return date ? date.toLocaleDateString("pt-BR") : "-";
      },
    },
    // {
    //   id: "actions",
    //   size: 10,
    //   cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
  ];
