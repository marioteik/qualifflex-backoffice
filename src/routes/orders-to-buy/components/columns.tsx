import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/atoms/data-table-column-header";
import type { SelectOrderToBuy } from "@/schemas/order-to-buy";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";

export const columns: (ColumnDef<SelectOrderToBuy> & { columnName?: string })[] = [
  {
    columnName: "Código Referência",
    accessorKey: "codeReference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código Referência" />
    ),
    size: 120,
    filterFn: (row, id, value: string) => {
      const codeReference = row.original.codeReference
        .toLowerCase()
        .split(" ")
        .join(",")
        .split(",");

      const createdAt = row.original.createdAt
        ? format(new Date(row.original.createdAt), "dd/MM/yyyy")
        : "";

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
                createdAt.includes(valueWord)
            )
        );
    },
  },
  {
    columnName: "Criado em",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt
        ? new Date(row.original.createdAt)
        : null;
      return date ? date.toLocaleDateString("pt-BR") : "-";
    },
    size: 60,
  },
  {
    columnName: "Qtd. Itens",
    accessorKey: "itemsQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. Itens" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full text-right">
          {row.original.itemsQuantity || 0}
        </div>
      );
    },
    size: 60,
  },
  {
    columnName: "Qtd. Produtos",
    accessorKey: "productsQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. Produtos" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full text-right">
          {row.original.productsQuantity || 0}
        </div>
      );
    },
    size: 60,
  },
  {
    columnName: "Valor Total",
    accessorKey: "totalValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor Total" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full text-right">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(row.original.totalValue || 0)}
        </div>
      );
    },
    size: 80,
  },
  {
    columnName: "Produtos",
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Produtos" />
    ),
    cell: ({ row }) => {
      const products = row.original.items?.map(
        (item) => item.product?.description
      ).filter(Boolean);

      return <div className="w-full text-center">{products?.join(", ")}</div>;
    },
    size: 120,
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    size: 10,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]; 