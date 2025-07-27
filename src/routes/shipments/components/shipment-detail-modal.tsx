import { useShipmentsStore } from "@/routes/shipments/data/store";
import { useShallow } from "zustand/react/shallow";
import { useShipment } from "@/api/shipments";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share, Truck, X } from "lucide-react";
import { formatToBRNumber } from "@/lib/utils/formatters";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useCopyValue } from "@/hooks/useCopyValue";
import ShipmentDetailOverview from "./detail-overview";
import ShipmentDetailItems from "./detail-items";
import ShipmentDetailMaterials from "./detail-materials";
import ShipmentDetailHistory from "./detail-history";
import { useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

export default function ShipmentDetailModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const {
    isDetailModalOpen,
    selectedShipmentId,
    setIsDetailModalOpen,
    setSelectedShipmentId,
  } = useShipmentsStore(
    useShallow((state) => ({
      isDetailModalOpen: state.isDetailModalOpen,
      selectedShipmentId: state.selectedShipmentId,
      setIsDetailModalOpen: state.setIsDetailModalOpen,
      setSelectedShipmentId: state.setSelectedShipmentId,
    }))
  );

  const { data: shipment, isLoading, error } = useShipment(selectedShipmentId!);
  const { isCopied, handleCopy } = useCopyValue();

  // Cleanup body styles when modal closes
  useEffect(() => {
    if (!isDetailModalOpen) {
      // Clean up any lingering body styles
      document.body.style.removeProperty('pointer-events');
    }
  }, [isDetailModalOpen]);

  // Handle search parameter synchronization - only sync from URL to state
  useEffect(() => {
    const shipmentIdFromSearch = searchParams.get("shipmentId");
    
    if (shipmentIdFromSearch) {
      // URL has shipment ID, sync with store if different
      if (shipmentIdFromSearch !== selectedShipmentId) {
        setSelectedShipmentId(shipmentIdFromSearch);
      }
      if (!isDetailModalOpen) {
        setIsDetailModalOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams to avoid loops

  const handleClose = () => {
    // First update the URL to remove the search param
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("shipmentId");
    navigate(`${location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`, { replace: true });
    
    // Then close the modal
    setIsDetailModalOpen(false);
    setSelectedShipmentId(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  // Always render the Dialog, no early return
  const shouldShowContent = isDetailModalOpen && selectedShipmentId;

  if (shouldShowContent && isLoading) {
    return (
      <Dialog open={isDetailModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-6xl h-[96vh] overflow-y-auto">
          <Card className="flex items-center justify-center min-h-[400px] border-0 shadow-none">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Carregando remessa...</span>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  if (shouldShowContent && (error || !shipment)) {
    return (
      <Dialog open={isDetailModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-6xl h-[96vh] overflow-y-auto">
          <Card className="flex items-center justify-center min-h-[400px] border-0 shadow-none">
            <div className="text-center">
              <p className="text-destructive mb-2">
                Erro ao carregar a remessa
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Não foi possível encontrar a remessa solicitada.
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
      {shouldShowContent && shipment && (
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

            <Tabs defaultValue="details" className="flex flex-col h-full">
              <Card className="flex flex-col mb-4 border-0 rounded-none">
                <CardHeader className="bg-muted/50 shrink p-0">
                  <div className="flex flex-row items-center justify-between p-4 pr-16">
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
                        <span className="sr-only">
                          Copiar o número da remessa
                        </span>
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
                      Produção
                    </TabsTrigger>
                    <TabsTrigger
                      value="materials"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Materiais
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Histórico
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
              </Card>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <TabsContent value="details" className="flex flex-col gap-4 mt-0">
                  <ShipmentDetailOverview shipment={shipment} />
                </TabsContent>

                <TabsContent value="items" className="mt-0">
                  <ShipmentDetailItems shipment={shipment} />
                </TabsContent>

                <TabsContent value="materials" className="mt-0">
                  <ShipmentDetailMaterials shipment={shipment} />
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <ShipmentDetailHistory shipment={shipment} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
