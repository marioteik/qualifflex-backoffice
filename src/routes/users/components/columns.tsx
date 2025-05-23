import { ColumnDef } from "@tanstack/react-table";

import { DataTableRowActions } from "./data-table-row-actions";
import { roles, status } from "@/routes/users/data/data";
import { cn } from "@/lib/utils";
import React from "react";
import { DataTableColumnHeader } from "@/components/atoms/data-table-column-header";
import type { User } from "@/schemas/auth";
import { formatToBRPhone } from "@/lib/utils/formatters";
import type { SelectProfile } from "@/schemas/profile";

export const columns: (ColumnDef<User> & { columnName?: string })[] = [
  {
    accessorKey: "id",
    columnName: "ID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    size: 10000,
    enableHiding: true,
  },
  {
    accessorKey: "profile",
    columnName: "Nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ getValue }) => {
      const value = getValue() as SelectProfile;

      if (!value?.fullName) {
        return "-";
      }

      return value.fullName;
    },
    size: 2000,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ getValue }) => {
      const value = getValue();

      if (!value) {
        return "-";
      }

      return value;
    },
    filterFn: (row: any, id: string, value: string): boolean => {
      const email = row.original.email ? row.original.email.toLowerCase() : "";
      const phone = row.original.phone ? row.original.phone.toLowerCase() : "";

      const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, " ");
      const sanitizedEmail = sanitize(email);
      const sanitizedPhone = sanitize(phone);

      const emailWords = sanitizedEmail.split(/\s+/);
      const phoneWords = sanitizedPhone.split(/\s+/);

      const filterWords = value.toLowerCase().trim().split(/\s+/);

      return filterWords.every((word) => {
        const emailMatch = emailWords.some((emailWord) =>
          emailWord.includes(word)
        );

        const phoneMatch = phoneWords.some((phoneWord) =>
          phoneWord.includes(word)
        );

        return emailMatch || phoneMatch;
      });
    },
    size: 10000,
    enableHiding: false,
  },
  {
    accessorKey: "phone",
    columnName: "Celular",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Celular" />
    ),
    cell: ({ getValue }) => {
      const value = getValue();

      if (!value) {
        return "-";
      }

      return formatToBRPhone(value as string);
    },
    size: 2000,
    enableHiding: true,
  },
  {
    accessorKey: "roleName",
    columnName: "Papel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Papel" />
    ),
    cell: ({ row }) => {
      const role = roles.find(
        (role) => role.value === row.original.roleId?.toString()
      );

      if (!role) {
        return "-";
      }

      return (
        <div className="flex w-full items-center">
          <role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{role.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) =>
      value.includes(row.original.roleId?.toString()),
    size: 2000,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const stat = status.find((role) => role.value === row.original.status);

      if (!stat) {
        return "-";
      }

      return (
        <div className="flex w-full items-center">
          <stat.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span
            className={cn(
              stat.value === "banned" && "text-muted-foreground",
              stat.value === "confirmed" && "text-success",
              stat.value === "not_confirmed" && "text-warning"
            )}
          >
            {stat.label}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.status);
    },
    size: 2000,
    columnName: "Status",
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
