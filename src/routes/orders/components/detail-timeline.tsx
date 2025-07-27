import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Truck,
  Package,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { formatDate, formatToBRNumber } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";

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
    const shipmentDate = shipment.systemEstimation;

    return shipmentDate > latest ? shipmentDate : latest;
  }, orderStartDate);

  const remainingDays = differenceInDays(latestDate, new Date()) || 1;

  const amountLate = shipments.filter((shipment) => shipment.systemEstimation && shipment.systemEstimation < new Date()).length;
  const runningShipments = shipments.filter((shipment) => !shipment.finishedAt).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-medium font-mono">{shipments.length}</p>
              <p className="text-sm text-muted-foreground">Remessas</p>
            </div>
            <div>
              <p className="text-xl font-medium font-mono">{formatDate(order.createdAt)}</p>
              <p className="text-sm text-muted-foreground">Início</p>
            </div>
            <div>
              <p className="text-xl font-medium font-mono">{remainingDays} dias</p>
              <p className="text-sm text-muted-foreground">Dias Restantes</p>
            </div>
            <div>
              <p className="text-xl font-medium font-mono">
                {latestDate
                  ? formatDate(latestDate)
                  : "Não definido"}
              </p>
              <p className="text-sm text-muted-foreground">Prazo Final</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-medium font-mono">
              {runningShipments}
            </p>
            <p className="text-sm text-muted-foreground">Em Andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-medium font-mono">
              {shipments.filter((s: any) => s.status === "Finalizado").length}
            </p>
            <p className="text-sm text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-medium font-mono">
              {shipments.filter((s: any) => s.status === "Coletado").length}
            </p>
            <p className="text-sm text-muted-foreground">Coletadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <XCircle className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-3xl font-medium font-mono">
              {shipments.filter((s: any) => s.status === "Recusado").length}
            </p>
            <p className="text-sm text-muted-foreground">Recusadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-3xl font-medium font-mono">
              {amountLate}
            </p>
            <p className="text-sm text-muted-foreground">Atrasadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
