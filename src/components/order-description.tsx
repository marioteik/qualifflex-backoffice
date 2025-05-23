import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreVertical,
  Truck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  formatCPFOrCNPJ,
  formatToBRL,
  formatToBRNumber,
  formatToBRPhone,
} from "@/lib/utils/formatters";
import type { SelectOrder } from "@/schemas/orders";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function OrderShipmentsList({
  next,
  prev,
  order,
  onClose,
}: {
  order: SelectOrder;
  onClose: () => void;
  next?: () => void;
  prev?: () => void;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<
    (typeof order.shipments)[number] | null
  >(null);
  const [selectedShipmentItem, setSelectedShipmentItem] = useState<
    (typeof order.shipmentItems)[number] | null
  >(null);

  const handleCopy = async (textToCopy?: string | null) => {
    try {
      await navigator.clipboard.writeText(textToCopy ?? "");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Falha ao copiar o dado");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-h-full overflow-y-auto">
      <CardHeader className="flex flex-row items-start bg-muted/50 shrink">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Ordem de Pedido N.º {formatToBRNumber(Number(order.codeReference))}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => handleCopy(order.codeReference)}
            >
              {isCopied ? (
                <Check className="text-success" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className="sr-only">
                Copiar o número da ordem de pedido
              </span>
            </Button>
          </CardTitle>
          <CardDescription>
            Data de criação:{" "}
            {format(order.createdAt, "dd/MM/yyyy", {
              locale: ptBR,
            })}
          </CardDescription>
        </div>
        {/*<div className="ml-auto flex items-center gap-1">*/}
        {/*  <DropdownMenu>*/}
        {/*    <DropdownMenuTrigger asChild>*/}
        {/*      <Button size="icon" variant="outline" className="h-8 w-8">*/}
        {/*        <MoreVertical className="h-3.5 w-3.5" />*/}
        {/*        <span className="sr-only">More</span>*/}
        {/*      </Button>*/}
        {/*    </DropdownMenuTrigger>*/}
        {/*    <DropdownMenuContent align="end">*/}
        {/*      <DropdownMenuItem>Exportar</DropdownMenuItem>*/}
        {/*    </DropdownMenuContent>*/}
        {/*  </DropdownMenu>*/}
        {/*</div>*/}
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-semibold mb-4">Remessas</h3>
        <div className="space-y-2">
          {order.shipments.map((shipment) => (
            <Dialog key={shipment.shipmentId}>
              <DialogTrigger asChild>
                <div
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedShipment(shipment)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        N.º {formatToBRNumber(Number(shipment.shipment.number))}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(shipment.shipment.createdAt, "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </DialogTrigger>

              {selectedShipment && (
                <ShipmentDetailsDialog
                  shipment={selectedShipment}
                  handleCopy={handleCopy}
                  isCopied={isCopied}
                  order={order}
                />
              )}
            </Dialog>
          ))}
        </div>
      </CardContent>

      <CardContent>
        <h3 className="text-lg font-semibold mb-4">
          Produtos da Ordem de Pedido
        </h3>
        <div className="space-y-2">
          {order.shipmentItems.map((item) => (
            <Dialog key={item.shipmentItemId}>
              <DialogTrigger asChild>
                <div
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedShipmentItem(item)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        N.º {item.shipmentItemId.slice(0, 6)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {item.shipmentItem.quantity}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </DialogTrigger>

              {selectedShipmentItem && (
                <ShipmentItemDetailsDialog
                  item={selectedShipmentItem}
                  handleCopy={handleCopy}
                  isCopied={isCopied}
                />
              )}
            </Dialog>
          ))}
        </div>
      </CardContent>
    </div>
  );
}

function ShipmentDetailsDialog({ shipment, handleCopy, isCopied, order }) {
  const totalProductValue = order.shipmentItems
    .filter((item) => item.shipmentItem.shipmentId === shipment.shipmentId)
    .reduce((acc, item) => acc + Number(item.shipmentItem.totalPrice), 0);

  return (
    <DialogContent className="max-w-2xl">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        {/* Keep original card header content */}
        {/* ... */}
      </CardHeader>
      <CardContent className="p-6 text-sm flex-1 overflow-y-auto">
        {/* Keep original card content */}
        {/* ... */}
      </CardContent>
    </DialogContent>
  );
}

function ShipmentItemDetailsDialog({ item, handleCopy, isCopied }) {
  return (
    <DialogContent className="max-w-xl">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Item #{item.shipmentItemId.slice(0, 6)}
          </CardTitle>
          <CardDescription>
            Adicionado em:{" "}
            {format(item.createdAt, "dd/MM/yyyy", { locale: ptBR })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm space-y-4">
        <div className="grid gap-3">
          <div className="font-semibold">Detalhes do Item</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Produto ID</dt>
              <dd>{item.shipmentItem.productId}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Quantidade</dt>
              <dd>{item.shipmentItem.quantity}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Preço Unitário</dt>
              <dd>{formatToBRL(item.shipmentItem.unitPrice)}</dd>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <dt className="text-muted-foreground">Total</dt>
              <dd>{formatToBRL(item.shipmentItem.totalPrice)}</dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </DialogContent>
  );
}
