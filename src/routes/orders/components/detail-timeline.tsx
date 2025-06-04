import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Truck,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatDate, formatToBRNumber } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface OrderDetailTimelineProps {
  order: any; // Replace with proper order type
}

export default function OrderDetailTimeline({
  order,
}: OrderDetailTimelineProps) {
  const shipments = order.shipments || [];

  if (shipments.length === 0) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-2">
            Nenhuma remessa para exibir
          </p>
          <p className="text-sm text-muted-foreground">
            O cronograma das remessas aparecerá aqui quando forem criadas.
          </p>
        </div>
      </Card>
    );
  }

  // Sort shipments by creation date
  const sortedShipments = [...shipments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Finalizado":
      case "Coletado":
        return CheckCircle;
      case "Recusado":
        return AlertCircle;
      case "Pendente":
      case "Pendente aprovação":
        return Clock;
      default:
        return Truck;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finalizado":
      case "Coletado":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "Recusado":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "Pendente":
      case "Pendente aprovação":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "Confirmado":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "Produzindo":
      case "Produção parcial":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffInDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays;
  };

  const orderStartDate = new Date(order.createdAt);
  const latestDate = shipments.reduce((latest, shipment) => {
    const shipmentDate = new Date(
      shipment.estimatedDelivery || shipment.createdAt
    );
    return shipmentDate > latest ? shipmentDate : latest;
  }, orderStartDate);

  const totalDays =
    Math.ceil(
      (latestDate.getTime() - orderStartDate.getTime()) / (1000 * 60 * 60 * 24)
    ) || 1;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">{shipments.length}</p>
              <p className="text-sm text-muted-foreground">Remessas</p>
            </div>
            <div>
              <p className="text-lg font-bold">{formatDate(order.createdAt)}</p>
              <p className="text-sm text-muted-foreground">Início do Pedido</p>
            </div>
            <div>
              <p className="text-lg font-bold">{totalDays} dias</p>
              <p className="text-sm text-muted-foreground">Duração Total</p>
            </div>
            <div>
              <p className="text-lg font-bold">
                {order.deliveryDate
                  ? formatDate(order.deliveryDate)
                  : "Não definido"}
              </p>
              <p className="text-sm text-muted-foreground">Prazo Final</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {
                shipments.filter((s: any) =>
                  [
                    "Pendente",
                    "Pendente aprovação",
                    "Confirmado",
                    "Produzindo",
                    "Produção parcial",
                  ].includes(s.status)
                ).length
              }
            </p>
            <p className="text-sm text-muted-foreground">Em Andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {shipments.filter((s: any) => s.status === "Finalizado").length}
            </p>
            <p className="text-sm text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {shipments.filter((s: any) => s.status === "Coletado").length}
            </p>
            <p className="text-sm text-muted-foreground">Coletadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {shipments.filter((s: any) => s.status === "Recusado").length}
            </p>
            <p className="text-sm text-muted-foreground">Recusadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="size-4" />
            Cronograma das Remessas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedShipments.map((shipment, index) => {
              const StatusIcon = getStatusIcon(shipment.status);
              const statusColor = getStatusColor(shipment.status);
              const daysSinceStart = calculateDuration(
                order.createdAt,
                shipment.createdAt
              );
              const daysToDeliver = shipment.estimatedDelivery
                ? calculateDuration(
                    shipment.createdAt,
                    shipment.estimatedDelivery
                  )
                : 0;

              return (
                <div key={shipment.id} className="relative">
                  {index !== sortedShipments.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                        statusColor
                      )}
                    >
                      <StatusIcon className="h-5 w-5" />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">
                          Remessa {formatToBRNumber(Number(shipment.number))}
                        </h4>
                        <Badge
                          variant="outline"
                          className={cn(statusColor.split(" ")[0])}
                        >
                          {shipment.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Criada em</p>
                          <p className="font-medium">
                            {formatDate(shipment.createdAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {daysSinceStart} dias após o pedido
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">
                            Previsão de Entrega
                          </p>
                          <p className="font-medium">
                            {shipment.estimatedDelivery
                              ? formatDate(shipment.estimatedDelivery)
                              : "Não definida"}
                          </p>
                          {daysToDeliver > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {daysToDeliver} dias de produção
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-muted-foreground">Produtos</p>
                          <p className="font-medium">
                            {shipment.itemsCount}{" "}
                            {shipment.itemsCount === 1 ? "produto" : "produtos"}
                          </p>
                          {shipment.totalValue && (
                            <p className="text-xs text-muted-foreground">
                              R$ {shipment.totalValue.toLocaleString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar for Timeline */}
                      <div className="mt-3">
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                          <span>Progresso</span>
                          <span>
                            {new Date() >
                            new Date(
                              shipment.estimatedDelivery || shipment.createdAt
                            )
                              ? "Prazo vencido"
                              : "No prazo"}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              shipment.status === "Finalizado"
                                ? "bg-green-500"
                                : shipment.status === "Recusado"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            )}
                            style={{
                              width:
                                shipment.status === "Finalizado"
                                  ? "100%"
                                  : shipment.status === "Recusado"
                                  ? "100%"
                                  : shipment.status === "Produzindo"
                                  ? "60%"
                                  : shipment.status === "Confirmado"
                                  ? "30%"
                                  : "10%",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
