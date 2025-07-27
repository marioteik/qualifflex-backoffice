import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { status, statusOrder } from "@/routes/shipments/data/data";
import { cn } from "@/lib/utils";
import React from "react";
import { DataTableColumnHeader } from "@/components/atoms/data-table-column-header";
import { format } from "date-fns";
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
      size: 10,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "number",
      columnName: "Referência",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Referência" />
      ),
      size: 150,
      enableHiding: false,
      filterFn: (row, id, value) => {
        const seamstressWords = (
          row.original.recipient?.businessInfo.tradeName ||
          (row.original.recipient?.businessInfo.nameCorporateReason?.split(
            " "
          )[0] ??
            "")
        )
          .toLowerCase()
          .split(" ")
          .join(",")
          .split(",");

        const numberWords = row.original.number
          .toLowerCase()
          .split(" ")
          .join(",")
          .split(",");

        const opsWords = row.original.items
          .map((item) =>
            item.shipmentItemToOrder?.order?.codeReference?.toLowerCase()
          )
          .join(",")
          .split(",");

        const descriptionWords = row.original.items
          .map((item) => item.product?.description?.toLowerCase())
          .join(",")
          .split(",");

        const issueDate = row.original.issueDate
          ? format(new Date(row.original.issueDate), "dd/MM/yyyy")
          : "";

        return value.some((valuePart: string) =>
          valuePart
            .toLowerCase()
            .split(" ")
            .every(
              (valueWord) =>
                seamstressWords.some((sectionWord) =>
                  sectionWord.includes(valueWord)
                ) ||
                numberWords.some((sectionWord) =>
                  sectionWord.includes(valueWord)
                ) ||
                opsWords.some((sectionWord) =>
                  sectionWord.includes(valueWord)
                ) ||
                descriptionWords.some((sectionWord) =>
                  sectionWord.toLowerCase().includes(valueWord)
                ) ||
                issueDate.includes(valueWord)
            )
        );
      },
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

        return <div className="w-full text-left">{value}</div>;
      },
      enableHiding: true,
      filterFn: (row, id, value: string[]) => {
        const rowValue =
          row.original.recipient?.businessInfo.tradeName ||
          row.original.recipient?.businessInfo.nameCorporateReason;

        if (!rowValue) return false;

        const rowWords = rowValue.toLowerCase().split(" ");

        return value?.some((valuePart) =>
          valuePart
            .toLowerCase()
            .split(" ")
            .every((valueWord) =>
              rowWords.some((rowWord) => rowWord.includes(valueWord))
            )
        );
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
              value === "Confirmado" && "bg-primary/80 text-primary-foreground",
              value === "Produzindo" &&
                "bg-warning/80 text-warning-foreground dark:bg-warning/70",
              value === "Produção parcial" &&
                "bg-warning text-warning-foreground dark:bg-warning/90",
              value === "Finalizado" &&
                "bg-success text-success-foreground  dark:bg-success/70",
              value === "Coletado" && "bg-muted text-muted-foreground",
              value === "Recusado" &&
                "bg-destructive text-destructive-foreground",
              "flex w-full items-center p-1 rounded-lg justify-center font-medium text-nowrap"
            )}
          >
            <div className="shrink">
              <stat.icon className="mr-2 h-4 w-4 ml-2" />
            </div>

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
      accessorKey: "issueDate",
      columnName: "Data de Emissão",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Emissão" />
      ),
      size: 200,
      cell: ({ row }) => (
        <div className="w-full text-center">
          {row.original.issueDate &&
            format(new Date(row.original.issueDate), "dd/MM/yyyy")}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "systemEstimation",
      columnName: "Prazo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prazo" />
      ),
      size: 200,
      cell: ({ row }) => (
        <div className="w-full text-center">
          {row.original.systemEstimation
            ? format(new Date(row.original.systemEstimation!), "dd/MM/yyyy")
            : "-"}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "informedEstimation",
      columnName: "Prazo requerido",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prazo requerido" />
      ),
      size: 200,
      cell: ({ row }) => (
        <div className="w-full text-center">
          {row.original.informedEstimation
            ? format(new Date(row.original.informedEstimation!), "dd/MM/yyyy")
            : "-"}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "offsetDays",
      columnName: "Offset",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Offset"
          className="text-right"
        />
      ),
      size: 100,
      cell: ({ row }) => (
        <div className="w-full text-right">
          {row.original.offsetDays === 0
            ? "0 dias"
            : row.original.offsetDays === 1 || row.original.offsetDays === -1
            ? row.original.offsetDays + " dia"
            : row.original.offsetDays + " dias"}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "description",
      columnName: "Descrição",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
      ),
      size: 200,
      cell: ({ row }) => {
        const value = row.original.items
          .map((item) => item.product?.description)
          .join(", ");
        return <div className="w-full text-left">{value}</div>;
      },
      enableHiding: true,
    },
    {
      accessorKey: "ops",
      columnName: "Ordem de Produção",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ordem de Produção" />
      ),
      size: 200,
      cell: ({ row }) => {
        const value = row.original.items
          .map((item) => item.shipmentItemToOrder?.order?.codeReference)
          .join(", ");
        return <div className="w-full text-left">{value}</div>;
      },
      enableHiding: true,
    },
    {
      id: "actions",
      size: 10,
      cell: ({ table, row }) => <DataTableRowActions row={row} table={table} />,
    },
  ];
