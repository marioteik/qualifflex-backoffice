import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "@/api/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share, Package } from "lucide-react";
import { formatToBRL, formatToBRNumber } from "@/lib/utils/formatters";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useCopyValue } from "@/hooks/useCopyValue";
import OrderDetailOverview from "./components/detail-overview";
import OrderDetailShipments from "./components/detail-shipments";
import OrderDetailProducts from "./components/detail-products";
import OrderDetailTimeline from "./components/detail-timeline";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useOrder(id!);
  const { isCopied, handleCopy } = useCopyValue();

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando pedido...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Erro ao carregar o pedido</p>
          <p className="text-sm text-muted-foreground mb-4">
            Não foi possível encontrar o pedido solicitado.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="text-sm text-primary hover:underline"
          >
            Voltar para pedidos
          </button>
        </div>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Pedido não encontrado</p>
          <button
            onClick={() => navigate("/orders")}
            className="text-sm text-primary hover:underline"
          >
            Voltar para pedidos
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="overview">
      <Card className="flex flex-col mb-4">
        <CardHeader className="bg-muted/50 shrink p-0">
          <div className="flex flex-row items-center justify-between p-4">
            <CardTitle className="group flex items-center gap-2 text-lg text-nowrap">
              Pedido {formatToBRNumber(Number(order?.number))}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleCopy(order?.number)}
              >
                {isCopied ? (
                  <Check className="text-success" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span className="sr-only">Copiar o número do pedido</span>
              </Button>
              <Badge
                variant="outline"
                className={cn(
                  order.status === "Pendente" &&
                    "bg-yellow-500/60 text-white dark:bg-yellow-400/70",
                  order.status === "Pendente aprovação" &&
                    "bg-yellow-500/80 text-white dark:bg-yellow-400/80",
                  order.status === "Confirmado" &&
                    "bg-primary/80 text-primary-foreground",
                  order.status === "Em produção" &&
                    "bg-warning/80 text-warning-foreground dark:bg-warning/70",
                  order.status === "Produção parcial" &&
                    "bg-warning text-warning-foreground dark:bg-warning/90",
                  order.status === "Finalizado" &&
                    "bg-success text-success-foreground  dark:bg-success/70",
                  order.status === "Entregue" &&
                    "bg-muted text-muted-foreground",
                  order.status === "Cancelado" &&
                    "bg-destructive text-destructive-foreground",
                  "flex w-full items-center p-1 rounded-lg justify-center font-medium text-nowrap"
                )}
              >
                <span className="sr-only">Status</span>
                {order.status}
              </Badge>
            </CardTitle>
            <div className="ml-auto flex items-center gap-2 !mt-0">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Package className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Acompanhar
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
                <span className="sr-only">Compartilhar o pedido</span>
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Compartilhar
                </span>
              </Button>
            </div>
          </div>
          <TabsList className="rounded-none justify-start px-4 !mt-0">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="shipments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Remessas
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Produtos
            </TabsTrigger>
          </TabsList>
        </CardHeader>
      </Card>

      <TabsContent value="overview">
        <OrderDetailTimeline order={order} />
      </TabsContent>

      <TabsContent value="shipments">
        <OrderDetailShipments order={order} />
      </TabsContent>

      <TabsContent value="products">
        <OrderDetailProducts order={order} />
      </TabsContent>
    </Tabs>
  );
}
