import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatToBRL, formatToBRNumber } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { SelectShipment, SelectShipmentItem } from "@/schemas/shipments";

interface OrderDetailProductsProps {
  order: any; // Replace with proper order type
}

export default function OrderDetailProducts({
  order,
}: OrderDetailProductsProps) {
  const products = order.shipmentItems || [];

  console.log(products);

  if (products.length === 0) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-2">
            Nenhum produto encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Os produtos aparecerão aqui quando forem adicionados ao pedido.
          </p>
        </div>
      </Card>
    );
  }

  const getProductionStatus = (product: SelectShipmentItem) => {
    const produced = product.producedQuantity || 0;
    const total = product.quantity || 0;

    if (produced === 0)
      return { status: "Pendente", color: "text-yellow-600", icon: Clock };
    if (produced < total)
      return { status: "Parcial", color: "text-orange-600", icon: Clock };
    if (produced === total)
      return {
        status: "Finalizado",
        color: "text-green-600",
        icon: CheckCircle,
      };
    return { status: "Erro", color: "text-red-600", icon: XCircle };
  };

  const totalQuantity = products.reduce(
    (sum: number, p: any) => sum + (p.quantity || 0),
    0
  );
  const totalProduced = products.reduce(
    (sum: number, p: any) => sum + (p.producedQuantity || 0),
    0
  );
  const totalValue = products.reduce(
    (sum: number, p: any) => sum + (p.quantity || 0) * (p.unitPrice || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Produtos do Pedido</h3>
        <Badge variant="secondary">
          {products.length} {products.length === 1 ? "produto" : "produtos"}
        </Badge>
      </div>

      {/* Products List */}
      <div className="grid gap-4">
        {products.map((product: SelectShipmentItem, index: number) => {
          const productionStatus = getProductionStatus(product);
          const StatusIcon = productionStatus.icon;
          const progressPercentage =
            ((product.producedQuantity || 0) / (product.quantity || 1)) * 100;

          return (<>
            <Card
              key={product.id || index}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {product.product.description || "Produto sem nome"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        productionStatus.color,
                        "flex items-center gap-1"
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {productionStatus.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Product Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Código</p>
                      <p className="font-medium">{product.product.code || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantidade</p>
                      <p className="font-medium">
                        {formatToBRNumber(product.quantity || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor Unitário</p>
                      <p className="font-medium">
                        {formatToBRL(product.unitPrice || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium">
                        {formatToBRL(
                          (product.quantity || 0) * (product.unitPrice || 0)
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Production Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Progresso de Produção
                      </span>
                      <span className="font-medium">
                        {product.producedQuantity || 0}/{product.quantity || 0}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  {/* Product Description */}
                  {product.description && (
                    <div className="pt-3 border-t">
                      <p className="text-muted-foreground text-xs">Descrição</p>
                      <p className="text-sm">{product.description}</p>
                    </div>
                  )}

                  {/* Specifications */}
                  {product.specifications &&
                    Object.keys(product.specifications).length > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-muted-foreground text-xs mb-2">
                          Especificações
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(product.specifications).map(
                            ([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {key}:
                                </span>
                                <span>{value as string}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="text-left">
              <p className="text-2xl font-medium text-muted-foreground font-mono">
                {products.filter((s: SelectShipment) => !s.finishedAt).length}
              </p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-muted-foreground font-mono">{products.filter((s: SelectShipment) => s.finishedAt).length}</p>
              <p className="text-sm text-muted-foreground">Produzidos</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-medium text-primary font-mono">
                {formatToBRL(products.reduce(
                  (sum: number, product: SelectShipmentItem) => sum + (product.quantity || 0) * (product.unitPrice || 0),
                  0
                ))}
              </p>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
          );
        })}
      </div>
    </div>
  );
}
