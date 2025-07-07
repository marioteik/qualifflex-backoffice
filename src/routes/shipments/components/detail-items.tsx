import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Eye } from "lucide-react";
import { formatToBRL, formatToBRNumber } from "@/lib/utils/formatters";
import { SelectShipment } from "@/schemas/shipments";
import { useNavigate } from "react-router-dom";

export default function ShipmentDetailItems({
  shipment,
}: {
  shipment: SelectShipment;
}) {
  const navigate = useNavigate();
  
  // Flatten all items from all orders
  const items = shipment.ordersToBuy.flatMap(order => order.items || []);

  if (items.length === 0) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-2">
            Nenhum produto encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Os produtos aparecerão aqui quando forem adicionados à remessa.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start gap-4">
        <h3 className="text-lg font-semibold">Produtos da Remessa</h3>
        <Badge variant="default">
          {items.length} {items.length === 1 ? "produto" : "produtos"}
        </Badge>
      </div>

      <div className="grid gap-2">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  {item.product?.description}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/80 text-primary-foreground"
                  >
                    Qtd: {formatToBRNumber(Number(item.quantity))}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Navigate to products page with search parameter
                      const searchTerm = item.product?.code || item.product?.description || '';
                      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Produto
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Código do Produto</p>
                  <p className="font-medium">{item.product?.code || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantidade</p>
                  <p className="font-medium">
                    {formatToBRNumber(Number(item.quantity))} unidades
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Unitário</p>
                  <p className="font-medium">
                    {formatToBRL(Number(item.product?.unitPrice || 0))}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Total</p>
                  <p className="font-medium">
                    {formatToBRL(
                      Number(item.totalPrice ?? item.product?.totalPrice)
                    )}
                  </p>
                </div>
              </div>


            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-muted-foreground">
                {items.reduce(
                  (sum: number, item) => sum + Number(item.quantity),
                  0
                )}
              </p>
              <p className="text-sm text-muted-foreground">Total de Unidades</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{items.length}</p>
              <p className="text-sm text-muted-foreground">Tipos de Produtos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {formatToBRL(shipment.financialCalc?.totalInvoiceValue || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
