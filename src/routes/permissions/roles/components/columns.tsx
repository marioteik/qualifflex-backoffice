import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { z } from "zod";
import { selectRoleSchema } from "@/schemas/roles";

export const columns: ColumnDef<z.infer<typeof selectRoleSchema>>[] = [
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Papel" />
    ),
    size: 1000,
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
