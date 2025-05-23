import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OrdersTable from "./components/data-table";
import type { SelectOrder } from "@/schemas/orders";
import OrderDescription from "@/components/order-description";

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<SelectOrder | null>(null);

  function handleSelectOrder(order: SelectOrder) {
    setSelectedOrder(order);
  }

  function handleClearSelection() {
    setSelectedOrder(null);
  }

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-5rem)]">
      <CardHeader className="flex-col gap-1 flex justify-between">
        <CardTitle>Ordens de Produção</CardTitle>
        <CardDescription>
          Acompanhe as Ordens de Produção ativas.
        </CardDescription>
      </CardHeader>
      <div className="flex-1 flex h-full max-h-[calc(100vh-11.45rem)]">
        <div className="flex-1 border-r h-full overflow-y-auto ml-4">
          <OrdersTable
            onSelectOrder={handleSelectOrder}
            selectedOrder={selectedOrder}
          />
        </div>
        <div className="shrink min-w-[34.125rem] h-full overflow-y-auto">
          {selectedOrder ? (
            <OrderDescription
              order={selectedOrder}
              onClose={handleClearSelection}
            />
          ) : (
            <div className="p-4 text-sm text-muted-foreground">
              Selecione um pedido na lista para visualizar detalhes.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
