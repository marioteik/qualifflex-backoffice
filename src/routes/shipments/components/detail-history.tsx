import { useShipmentHistory } from "@/api/shipments";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { SelectShipment } from "@/schemas/shipments";
import { format } from "date-fns";
import { useMemo } from "react";

const getStatusDescription = (status?: string) => {
  switch (status) {
    case "Confirmado":
      return "Remessa confirmada pela costureira";
    case "Coletado":
      return "Remessa coletada";
    case "Finalizado":
      return "Remessa finalizada";
    case "Produzindo":
      return "Remessa em produção";
    case "Produção parcial":
      return "Remessa em produção parcial";
    case "Recusado":
      return "Remessa recusada";
    case "Pendente":
      return "Remessa pendente";
    case "Pendente aprovação":
      return "Remessa pendente aprovação";
    default:
      return "Status atualizado";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Importado":
      return "bg-blue-500";
    case "Confirmado":
      return "bg-green-500";
    case "Coletado":
      return "bg-yellow-500";
    case "Produzindo":
    case "Produção parcial":
      return "bg-orange-500";
    case "Finalizado":
    case "Entregue":
      return "bg-emerald-500";
    case "Recusado":
      return "bg-red-500";
    case "Pendente":
      return "bg-gray-500";
    case "Pendente aprovação":
      return "bg-yellow-500";
    default:
      return "bg-blue-500";
  }
};

export default function ShipmentDetailHistory({
  shipment,
}: {
  shipment: SelectShipment;
}) {
  const { data: history } = useShipmentHistory(shipment.id);

  const historyItems = useMemo(() => {
    const items = [
      {
        status: "Importado",
        updated_at: format(shipment.createdAt, "dd/MM/yyyy HH:mm"),
        updated_by: "Sistema",
        description: "Remessa importada do CIGAM",
      },
    ];

    if (history && history.length > 0) {
      const historyMapped = history.map((item) => ({
        status: getStatusDescription(item.status),
        updated_at: format(
          item.updatedAt ?? item.createdAt,
          "dd/MM/yyyy HH:mm"
        ),
        updated_by: "Sistema",
        description: getStatusDescription(item.status),
      }));
      items.push(...historyMapped);
    }

    return items;
  }, [history, shipment]);

  return (
    <Card>
      <CardContent className="p-6 text-sm flex-1 overflow-y-auto">
        <div className="flex flex-col w-full gap-6">
          <div className="font-semibold text-lg">Histórico da Remessa</div>

          {/* Timeline */}
          <div className="relative">
            {historyItems.map((item, index) => (
              <div
                key={index}
                className="relative flex items-start pb-6 last:pb-0"
              >
                {/* Timeline line */}
                {index !== historyItems.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
                )}

                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor(
                    item.status
                  )} flex-shrink-0`}
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>

                {/* Content */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">
                      {item.status}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {item.updated_at}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por: {item.updated_by}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {historyItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum histórico disponível
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
