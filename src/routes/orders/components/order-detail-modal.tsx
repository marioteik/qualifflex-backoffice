import { useOrdersStore } from "@/routes/orders/data/store";
import { useShallow } from "zustand/react/shallow";
import { useOrder } from "@/api/orders";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share, Package, X } from "lucide-react";
import { formatToBRNumber } from "@/lib/utils/formatters";
import { Loader2 } from "lucide-react";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useCopyValue } from "@/hooks/useCopyValue";
import OrderDetailShipments from "./detail-shipments";
import OrderDetailProducts from "./detail-products";
import OrderDetailTimeline from "./detail-timeline";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrderDetailModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isDetailModalOpen,
    selectedOrderId,
    setIsDetailModalOpen,
    setSelectedOrderId,
  } = useOrdersStore(
    useShallow((state) => ({
      isDetailModalOpen: state.isDetailModalOpen,
      selectedOrderId: state.selectedOrderId,
      setIsDetailModalOpen: state.setIsDetailModalOpen,
      setSelectedOrderId: state.setSelectedOrderId,
    }))
  );

  const { data: order, isLoading, error } = useOrder(selectedOrderId!);
  const { isCopied, handleCopy } = useCopyValue();

  // Cleanup body styles when modal closes
  useEffect(() => {
    if (!isDetailModalOpen) {
      // Clean up any lingering body styles
      document.body.style.removeProperty('pointer-events');
    }
  }, [isDetailModalOpen]);

  // Handle URL synchronization
  useEffect(() => {
    const pathMatch = location.pathname.match(/\/orders\/(.+)$/);
    if (pathMatch && pathMatch[1]) {
      const orderIdFromUrl = pathMatch[1];

      // Only update if we have a different order ID
      if (orderIdFromUrl !== selectedOrderId) {
        setSelectedOrderId(orderIdFromUrl);
      }

      // Only open modal if it's not already open
      if (!isDetailModalOpen) {
        setIsDetailModalOpen(true);
      }
    } else if (isDetailModalOpen && selectedOrderId) {
      // If URL doesn't have order ID but modal is open, close it
      setIsDetailModalOpen(false);
      setSelectedOrderId(null);
    }
  }, [location.pathname]);

  const handleClose = () => {
    setIsDetailModalOpen(false);
    setSelectedOrderId(null);
    // Navigate back to the orders page
    navigate("/orders", { replace: true });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  // Always render the Dialog, no early return
  const shouldShowContent = isDetailModalOpen && selectedOrderId;

  if (shouldShowContent && isLoading) {
    return (
      <Dialog open={isDetailModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-6xl h-[96vh] overflow-y-auto">
          <Card className="flex items-center justify-center min-h-[400px] border-0 shadow-none">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando pedido...</span>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  if (shouldShowContent && (error || !order)) {
    return (
      <Dialog open={isDetailModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-6xl h-[96vh] overflow-y-auto">
          <Card className="flex items-center justify-center min-h-[400px] border-0 shadow-none">
            <div className="text-center">
              <p className="text-destructive mb-2">Erro ao carregar o pedido</p>
              <p className="text-sm text-muted-foreground mb-4">
                Não foi possível encontrar o pedido solicitado.
              </p>
              <Button onClick={handleClose} variant="outline">
                Fechar
              </Button>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isDetailModalOpen} onOpenChange={handleOpenChange}>
      {shouldShowContent && order && (
        <DialogContent className="max-w-6xl h-[96vh] overflow-y-auto p-0">
          <div className="flex flex-col h-full">
            {/* Close button */}
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 bg-background"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            </div>

            <Tabs defaultValue="overview" className="flex flex-col h-full">
              <Card className="flex flex-col mb-4 border-0 rounded-none">
                <CardHeader className="bg-muted/50 shrink p-0">
                  <div className="flex flex-row items-center justify-between p-4 pr-16">
                    <CardTitle className="group flex items-center gap-2 text-lg text-nowrap">
                      Ordem de Produção {formatToBRNumber(Number(order?.codeReference))}
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleCopy(order?.codeReference)}
                      >
                        {isCopied ? (
                          <Check className="text-success" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span className="sr-only">Copiar o número do pedido</span>
                      </Button>
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
                      value="materials"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Materiais
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
              </Card>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <TabsContent
                  value="overview"
                  className="flex flex-col gap-4 mt-0"
                >
                  <OrderDetailTimeline order={order} />
                </TabsContent>

                <TabsContent value="shipments" className="mt-0">
                  <OrderDetailShipments order={order} />
                </TabsContent>

                <TabsContent value="materials" className="mt-0">
                  <OrderDetailProducts order={order} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
