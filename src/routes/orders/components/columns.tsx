// routes/orders/components/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/atoms/data-table-column-header";
import type { ListOrders } from "@/schemas/orders";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";

export const columns: (ColumnDef<ListOrders> & { columnName?: string })[] = [
  {
    columnName: "Código Referência",
    accessorKey: "codeReference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código Referência" />
    ),
    size: 120,
    filterFn: (row, id, value: string) => {
      console.log(value);

      const codeReference = row.original.codeReference
        .toLowerCase()
        .split(" ")
        .join(",")
        .split(",");

      const shipmentNumber = row.original.shipments
        .map((shipment) => shipment.shipment.number)
        .join(",")
        .split(",");

      const materialWords = row.original.shipmentItems.map(
        (item) => item.shipmentItem.product?.description
      );

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
                shipmentNumber.some((sectionWord) =>
                  sectionWord.includes(valueWord)
                ) ||
                materialWords.some((sectionWord) =>
                  sectionWord.toLowerCase().includes(valueWord)
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
    columnName: "Qtd. Remessas",
    accessorKey: "shipments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. Remessas" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full text-right">
          {row.original.shipments ? row.original.shipments.length : 0}
        </div>
      );
    },
    size: 60,
  },
  {
    columnName: "Qtd. Itens",
    accessorKey: "itens",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. Itens" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full text-right">
          {row.original.shipments
            ? row.original.shipmentItems.reduce(
                (it, item) => it + parseFloat(item.shipmentItem.quantity),
                0
              )
            : 0}
        </div>
      );
    },
    size: 60,
  },
  {
    columnName: "Materiais",
    accessorKey: "materials",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Materiais" />
    ),
    cell: ({ row }) => {
      const materials = row.original.shipmentItems?.map(
        (item) => item.shipmentItem.product?.description
      );

      return <div className="w-full text-center">{materials?.join(", ")}</div>;
    },
    // enableHiding: true,
    size: 60,
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    size: 10,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
