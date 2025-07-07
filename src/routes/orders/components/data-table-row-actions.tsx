import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, EyeIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useOrdersStore } from "../data/store";
import { useShallow } from "zustand/react/shallow";
import type { OrdersRow } from "../data/store";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const {
    setRow,
    setIsEditOpen,
    setIsDeleteOpen,
    setIsDetailModalOpen,
    setSelectedOrderId,
  } = useOrdersStore(
    useShallow((state) => ({
      setRow: state.setRow,
      setIsEditOpen: state.setIsEditOpen,
      setIsDeleteOpen: state.setIsDeleteOpen,
      setIsDetailModalOpen: state.setIsDetailModalOpen,
      setSelectedOrderId: state.setSelectedOrderId,
    }))
  );

  const handleOpenDetail = useCallback(() => {
    const orderId = (row.original as any).id;

    // Set the order ID and open modal
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
    // Update URL to support deep linking
    navigate(`${location.pathname}/${orderId}`, { replace: true });
  }, [
    row.original,
    setSelectedOrderId,
    setIsDetailModalOpen,
    navigate,
    location.pathname,
  ]);

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
      <Button
        variant="ghost"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        onClick={handleOpenDetail}
      >
        <EyeIcon className="h-4 w-4" />
        <span className="sr-only">Ver detalhes</span>
      </Button>

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
