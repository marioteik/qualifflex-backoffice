import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { useProductsStore } from "../data/store";
import { useShallow } from "zustand/react/shallow";
import type { ProductsRow } from "../data/store";
import { useState } from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = useState(false);
  const { setRow, setIsEditOpen, setIsDeleteOpen } = useProductsStore(
    useShallow((state) => ({
      setRow: state.setRow,
      setIsEditOpen: state.setIsEditOpen,
      setIsDeleteOpen: state.setIsDeleteOpen,
    })),
  );

  const handleEdit = () => {
    setRow(row.original as ProductsRow);
    setIsEditOpen(true);
  };

  const handleDelete = () => {
    setRow(row.original as ProductsRow);
    setIsDeleteOpen(true);
  };

  return (
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
        <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Deletar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
