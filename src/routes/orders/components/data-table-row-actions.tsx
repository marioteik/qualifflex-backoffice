import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, EyeIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { useOrdersStore } from "../data/store";
import { useShallow } from "zustand/react/shallow";
import type { OrdersRow } from "../data/store";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  detailPath?: string;
}

export function DataTableRowActions<TData>({
  row,
  detailPath,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const { setRow, setIsEditOpen, setIsDeleteOpen } = useOrdersStore(
    useShallow((state) => ({
      setRow: state.setRow,
      setIsEditOpen: state.setIsEditOpen,
      setIsDeleteOpen: state.setIsDeleteOpen,
    }))
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
    <div className="inline-flex items-center justify-end w-full gap-2">
      {detailPath && (
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          asChild
        >
          <Link to={detailPath}>
            <EyeIcon className="h-4 w-4" />
            <span className="sr-only">Ver detalhes</span>
          </Link>
        </Button>
      )}

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
    </div>
  );
}
