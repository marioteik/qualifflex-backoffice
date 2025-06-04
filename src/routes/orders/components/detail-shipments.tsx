import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Package, Calendar, Eye } from "lucide-react";
import {
  formatToBRL,
  formatDate,
  formatToBRNumber,
} from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface OrderDetailShipmentsProps {
  order: any; // Replace with proper order type
}

export default function OrderDetailShipments({
  order,
}: OrderDetailShipmentsProps) {
  const navigate = useNavigate();

  const shipments = order.shipments || [];

  if (shipments.length === 0) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-2">
            Nenhuma remessa encontrada
          </p>
          <p className="text-sm text-muted-foreground">
            As remessas aparecerão aqui quando forem criadas para este pedido.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Remessas do Pedido</h3>
        <Badge variant="secondary">
          {shipments.length} {shipments.length === 1 ? "remessa" : "remessas"}
        </Badge>
      </div>

      <div className="grid gap-4">
        {shipments.map((shipment: any) => (
          <Card key={shipment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Remessa {formatToBRNumber(Number(shipment.number))}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      shipment.status === "Pendente" &&
                        "bg-yellow-500/60 text-white dark:bg-yellow-400/70",
                      shipment.status === "Pendente aprovação" &&
                        "bg-yellow-500/80 text-white dark:bg-yellow-400/80",
                      shipment.status === "Confirmado" &&
                        "bg-primary/80 text-primary-foreground",
                      shipment.status === "Produzindo" &&
                        "bg-warning/80 text-warning-foreground dark:bg-warning/70",
                      shipment.status === "Produção parcial" &&
                        "bg-warning text-warning-foreground dark:bg-warning/90",
                      shipment.status === "Finalizado" &&
                        "bg-success text-success-foreground dark:bg-success/70",
                      shipment.status === "Coletado" &&
                        "bg-muted text-muted-foreground",
                      shipment.status === "Recusado" &&
                        "bg-destructive text-destructive-foreground"
                    )}
                  >
                    {shipment.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/shipments/${shipment.id}`)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Data de Criação</p>
                  <p className="font-medium">
                    {formatDate(shipment.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Previsão de Entrega</p>
                  <p className="font-medium">
                    {shipment.estimatedDelivery
                      ? formatDate(shipment.estimatedDelivery)
                      : "Não definida"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Produtos</p>
                  <p className="font-medium">
                    {shipment.itemsCount}{" "}
                    {shipment.itemsCount === 1 ? "produto" : "produtos"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor</p>
                  <p className="font-medium">
                    {formatToBRL(shipment.totalValue)}
                  </p>
                </div>
              </div>

              {shipment.description && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-muted-foreground text-xs">Observações</p>
                  <p className="text-sm">{shipment.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-muted-foreground">
                {shipments.filter((s: any) => s.status === "Finalizado").length}
              </p>
              <p className="text-sm text-muted-foreground">Finalizadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">
                {
                  shipments.filter((s: any) =>
                    ["Pendente", "Confirmado", "Produzindo"].includes(s.status)
                  ).length
                }
              </p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatToBRL(
                  shipments.reduce(
                    (sum: number, s: any) => sum + (s.totalValue || 0),
                    0
                  )
                )}
              </p>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
