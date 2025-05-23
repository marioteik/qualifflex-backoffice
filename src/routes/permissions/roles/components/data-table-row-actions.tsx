import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import {
  type RolesRow,
  useRolesStore,
} from "@/routes/permissions/roles/data/store";
import { useShallow } from "zustand/react/shallow";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);
  const { setRow, setIsEditOpen, setIsDeleteOpen } = useRolesStore(
    useShallow((state) => ({
      setRow: state.setRow,
      setIsEditOpen: state.setIsEditOpen,
      setIsDeleteOpen: state.setIsDeleteOpen,
    })),
  );

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setRow(row.original as RolesRow);
              setIsEditOpen(true);
            }}
          >
            Edit
            <DropdownMenuShortcut>⌘↵</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setRow(row.original as RolesRow);
              setIsDeleteOpen(true);
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
