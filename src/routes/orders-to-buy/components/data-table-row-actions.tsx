import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SelectOrderToBuy } from "@/schemas/order-to-buy";
import { useOrdersToBuyStore } from "../data/store";
import { useShallow } from "zustand/react/shallow";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const orderToBuy = row.original as SelectOrderToBuy;

  const { setIsDetailModalOpen, setSelectedOrderToBuyId } = useOrdersToBuyStore(
    useShallow((state) => ({
      setIsDetailModalOpen: state.setIsDetailModalOpen,
      setSelectedOrderToBuyId: state.setSelectedOrderToBuyId,
    }))
  );

  const handleViewDetails = () => {
    setSelectedOrderToBuyId(orderToBuy.id);
    setIsDetailModalOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleViewDetails}>
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(orderToBuy.id);
          }}
        >
          Copiar ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 