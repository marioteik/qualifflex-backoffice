import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package2, Eye, Boxes } from "lucide-react";
import { formatToBRL, formatToBRNumber } from "@/lib/utils/formatters";
import { SelectShipment } from "@/schemas/shipments";
import { useNavigate } from "react-router-dom";

export default function ShipmentDetailMaterials({
  shipment,
}: {
  shipment: SelectShipment;
}) {
  const navigate = useNavigate();

  // Use direct items from shipment
  const materials = shipment.items || [];

  if (materials.length === 0) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <Package2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-2">
            Nenhum material encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Os materiais aparecerão aqui quando forem adicionados à remessa.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start gap-4">
        <h3 className="text-lg font-semibold">Materiais da Remessa</h3>
        <Badge variant="default">
          {materials.length} {materials.length === 1 ? "material" : "materiais"}
        </Badge>
      </div>

      <div className="grid gap-2">
        {materials.map((material) => (
          <Card key={material.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Boxes className="h-4 w-4" />
                    {material.product?.description || "Material sem descrição"}
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Navigate to products page with search parameter
                      const searchTerm =
                        material.product?.code ||
                        material.product?.description ||
                        "";
                      navigate(
                        `/products?search=${encodeURIComponent(searchTerm)}`
                      );
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Material
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Código do Material</p>
                  <p className="font-medium">
                    {material.product?.code || "N/A"}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-muted-foreground">Tamanho</p>
                  <p className="font-medium">
                    <span className="font-mono">
                      {material?.size?.name ?? "N/A"}
                    </span>
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-muted-foreground">Unidade</p>
                  <p className="font-medium">
                    <span className="font-mono">
                      {material?.unit?.unitName ?? "N/A"}
                    </span>
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-muted-foreground">Quantidade</p>
                  <p className="font-medium">
                    <span className="font-mono">
                      {formatToBRNumber(Number(material.quantity))}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Valor Unitário</p>
                  <p className="font-medium">
                    <span className="font-mono">
                      {formatToBRL(Number(material?.unitPrice || 0))}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Valor Total</p>
                  <p className="font-medium">
                    <span className="font-mono">
                      {formatToBRL(
                        Number(
                          material.totalPrice ??
                            material.quantity * material.unitPrice
                        )
                      )}
                    </span>
                  </p>
                </div>
              </div>

              {material.product && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {material.product.ncm && (
                      <div>
                        <p className="text-muted-foreground">NCM</p>
                        <p className="font-medium">{material.product.ncm}</p>
                      </div>
                    )}
                    {material.product.cfop && (
                      <div>
                        <p className="text-muted-foreground">CFOP</p>
                        <p className="font-medium">{material.product.cfop}</p>
                      </div>
                    )}
                    {material.product.unit && (
                      <div>
                        <p className="text-muted-foreground">Unidade</p>
                        <p className="font-medium">{material.product.unit}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="text-left">
              <p className="text-2xl font-medium text-muted-foreground font-mono">
                {materials.reduce(
                  (sum: number, material) => sum + Number(material.quantity),
                  0
                )}
              </p>
              <p className="text-sm text-muted-foreground">Total de Unidades</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-muted-foreground font-mono">
                {materials.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Variedades de Materiais
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-medium text-primary font-mono">
                {formatToBRL(
                  materials.reduce(
                    (sum: number, material) =>
                      sum +
                      Number(
                        material.totalPrice ??
                          material.quantity * material.unitPrice
                      ),
                    0
                  )
                )}
              </p>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
