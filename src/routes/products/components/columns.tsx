import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/atoms/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import type { SelectProduct } from "@/schemas/products";
import React from "react";
import { formatToBRL } from "@/lib/utils/formatters";

export const columns: (ColumnDef<SelectProduct> & { columnName?: string })[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Selecionar todos"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Selecionar item"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   size: 10,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    columnName: "ID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    size: 10,
    enableHiding: true,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código" />
    ),
    size: 10,
    filterFn: (row, id, value: string) => {
      console.log(value);

      const codeReference = row.original.code
        .toLowerCase()
        .split(" ")
        .join(",")
        .split(",");

      const descriptionWords = row.original.description
        ?.toLowerCase()
        .split(" ")
        .join(",")
        .split(",");

      return value
        .replace(" ", ",")
        .split(",")
        .some((valuePart: string) =>
          valuePart
            .toLowerCase()
            .split(" ")
            .every(
              (valueWord) =>
                codeReference.some((sectionWord) =>
                  sectionWord.includes(valueWord)
                ) ||
                descriptionWords.some((sectionWord) =>
                  sectionWord.includes(valueWord)
                )
            )
        );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    size: 10000,
  },
  {
    accessorKey: "unitPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preço Unit." />
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {formatToBRL(Number(row.original.unitPrice))}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "inShipments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Em Produção" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.inShipments}</div>
    ),
    size: 120,
  },
  {
    accessorKey: "inOrders",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Em OPs" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.inOrders}</div>
    ),
    size: 120,
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    size: 0,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
