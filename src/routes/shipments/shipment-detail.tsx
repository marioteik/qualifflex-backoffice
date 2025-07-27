import { useParams, useNavigate } from "react-router-dom";
import { useShipment } from "@/api/shipments";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share, Truck } from "lucide-react";
import { formatToBRNumber } from "@/lib/utils/formatters";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useCopyValue } from "@/hooks/useCopyValue";
import ShipmentDetailOverview from "./components/detail-overview";
import ShipmentDetailItems from "./components/detail-items";
import ShipmentDetailHistory from "./components/detail-history";
import ShipmentDetailChat from "./components/detail-chat";

export default function ShipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: shipment, isLoading, error } = useShipment(id!);
  const { isCopied, handleCopy } = useCopyValue();

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando remessa...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Erro ao carregar a remessa</p>
          <p className="text-sm text-muted-foreground mb-4">
            Não foi possível encontrar a remessa solicitada.
          </p>
          <button
            onClick={() => navigate("/shipments")}
            className="text-sm text-primary hover:underline"
          >
            Voltar para remessas
          </button>
        </div>
      </Card>
    );
  }

  if (!shipment) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Remessa não encontrada</p>
          <button
            onClick={() => navigate("/shipments")}
            className="text-sm text-primary hover:underline"
          >
            Voltar para remessas
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="details">
      <Card className="flex flex-col mb-4">
        <CardHeader className="bg-muted/50 shrink p-0">
          <div className="flex flex-row items-center justify-between p-4">
            <CardTitle className="group flex items-center gap-2 text-lg text-nowrap">
              Remessa {formatToBRNumber(Number(shipment?.number))}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleCopy(shipment?.number)}
              >
                {isCopied ? (
                  <Check className="text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span className="sr-only">Copiar o número da remessa</span>
              </Button>
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
                    "bg-success text-success-foreground  dark:bg-success/70",
                  shipment.status === "Coletado" &&
                    "bg-muted text-muted-foreground",
                  shipment.status === "Recusado" &&
                    "bg-destructive text-destructive-foreground",
                  "flex w-full items-center p-1 rounded-lg justify-center font-medium text-nowrap"
                )}
              >
                <span className="sr-only">Status</span>
                {shipment.status}
              </Badge>
            </CardTitle>
            <div className="ml-auto flex items-center gap-2 !mt-0">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Truck className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Rastrear
                </span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1"
                onClick={() => handleCopy(window.location.href)}
              >
                {isCopied ? (
                  <Check className="text-success" />
                ) : (
                  <Share className="h-3.5 w-3.5" />
                )}
                <span className="sr-only">Compartilhar a remessa</span>
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Compartilhar
                </span>
              </Button>
            </div>
          </div>
          <TabsList className="rounded-none justify-start px-4 !mt-0">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Detalhes
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Produtos
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Histórico
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Chat
            </TabsTrigger>
          </TabsList>
        </CardHeader>
      </Card>

      <TabsContent value="details" className="flex flex-col gap-4">
        <ShipmentDetailOverview shipment={shipment} />
      </TabsContent>

      <TabsContent value="items">
        <ShipmentDetailItems shipment={shipment} />
      </TabsContent>

      <TabsContent value="history">
        <ShipmentDetailHistory shipment={shipment} />
      </TabsContent>

      <TabsContent value="chat">
        <ShipmentDetailChat shipment={shipment} />
      </TabsContent>
    </Tabs>
  );
}
