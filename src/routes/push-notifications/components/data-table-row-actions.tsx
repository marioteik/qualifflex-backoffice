import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { PushNotification } from "@/schemas/push-notifications";

interface DataTableRowActionsProps {
  row: Row<PushNotification>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const notification = row.original;

  const handleCopyId = () => {
    navigator.clipboard.writeText(notification.id);
    toast.success("ID copiado para a área de transferência");
  };

  const handleViewDetails = () => {
    // TODO: Implement view details modal
    toast.info("Funcionalidade em desenvolvimento");
  };

  const handleResend = () => {
    // TODO: Implement resend functionality
    toast.info("Funcionalidade de reenvio em desenvolvimento");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>
          <Copy className="mr-2 h-4 w-4" />
          Copiar ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleResend}
          disabled={notification.status !== "failed"}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reenviar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}