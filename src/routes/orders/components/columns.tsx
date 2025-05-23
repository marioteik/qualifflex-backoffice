// routes/orders/components/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/atoms/data-table-column-header";
import type { SelectOrder } from "@/schemas/orders";

export const columns: ColumnDef<SelectOrder>[] = [
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
    accessorKey: "codeReference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código Referência" />
    ),
    size: 10,
  },
  {
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
    size: 140,
  },
  {
    accessorKey: "shipments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. Remessas" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full text-center">
          {row.original.shipments ? row.original.shipments.length : 0}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "itens",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. Itens" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-full text-center">
          {row.original.shipments
            ? row.original.shipmentItems.reduce(
                (it, item) => it + item.shipmentItem.quantity,
                0
              )
            : 0}
        </div>
      );
    },
    size: 120,
  },
  // {
  //   id: "actions",
  //   enableSorting: false,
  //   enableHiding: false,
  //   size: 10,
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
