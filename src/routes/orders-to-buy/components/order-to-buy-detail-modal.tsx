import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOrdersToBuyStore } from "../data/store";
import { useShallow } from "zustand/react/shallow";
import { useOrderToBuy } from "@/api/orders-to-buy";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function OrderToBuyDetailModal() {
  const { isDetailModalOpen, setIsDetailModalOpen, selectedOrderToBuyId } =
    useOrdersToBuyStore(
      useShallow((state) => ({
        isDetailModalOpen: state.isDetailModalOpen,
        setIsDetailModalOpen: state.setIsDetailModalOpen,
        selectedOrderToBuyId: state.selectedOrderToBuyId,
      }))
    );

  const { data: orderToBuy, isLoading } = useOrderToBuy(
    selectedOrderToBuyId || ""
  );

  if (!selectedOrderToBuyId) return null;

  return (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Ordem de Compra</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a ordem de compra selecionada.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : orderToBuy ? (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Informações Gerais</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Código de Referência:
                    </span>
                    <p className="font-medium">{orderToBuy.codeReference}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Criado em:
                    </span>
                    <p className="font-medium">
                      {orderToBuy.createdAt
                        ? format(new Date(orderToBuy.createdAt), "PPP", {
                            locale: ptBR,
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Quantidades</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Quantidade de Itens:
                    </span>
                    <p className="font-medium">{orderToBuy.itemsQuantity}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Quantidade de Produtos:
                    </span>
                    <p className="font-medium">{orderToBuy.productsQuantity}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Valor Total:
                    </span>
                    <p className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(orderToBuy.totalValue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            {orderToBuy.items && orderToBuy.items.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Itens da Ordem</h3>
                <div className="space-y-3">
                  {orderToBuy.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="border rounded-lg p-4"
                    >
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Produto:
                          </span>
                          <p className="font-medium">
                            {item.product?.description || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Quantidade:
                          </span>
                          <p className="font-medium">{item.quantity}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Preço Total:
                          </span>
                          <p className="font-medium">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Preço Unitário:
                          </span>
                          <p className="font-medium">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Não foi possível carregar os detalhes da ordem de compra.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 