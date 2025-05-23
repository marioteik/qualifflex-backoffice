import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import React from "react";

import { useOrdersStore } from "../data/store";
import { useShallow } from "zustand/react/shallow";
import type { OrdersRow } from "../data/store";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const { setRow, setIsEditOpen, setIsDeleteOpen } = useOrdersStore(
    useShallow((state) => ({
      setRow: state.setRow,
      setIsEditOpen: state.setIsEditOpen,
      setIsDeleteOpen: state.setIsDeleteOpen,
    })),
  );

  function handleEdit() {
    setRow(row.original as OrdersRow);
    setIsEditOpen(true);
  }

  function handleDelete() {
    setRow(row.original as OrdersRow);
    setIsDeleteOpen(true);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Deletar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
