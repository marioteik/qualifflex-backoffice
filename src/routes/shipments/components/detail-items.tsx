import { Card, CardContent } from "@/components/ui/card";
import { formatToBRL } from "@/lib/utils/formatters";
import { SelectShipment } from "@/schemas/shipments";

export default function ShipmentDetailItems({
  shipment,
}: {
  shipment: SelectShipment;
}) {
  return (
    <Card>
      <CardContent className="p-6 text-sm flex-1 overflow-y-auto grid gap-8 grid-cols-2">
        <div className="flex flex-col w-full gap-8">
          <div className="font-semibold">Detalhes da Remessa</div>
          <ul className="grid gap-4">
            {shipment.items?.map((item) => (
              <li className="flex items-center justify-between" key={item.id}>
                <span className="text-muted-foreground">
                  <span>{item.product?.description}</span>{" "}
                  <span className="text-nowrap">x {item.quantity}</span>
                </span>
                <span>
                  {formatToBRL(
                    Number(item.totalPrice ?? item.product?.totalPrice)
                  )}
                </span>
              </li>
            ))}
          </ul>
          <ul className="grid gap-1">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Total dos produtos</span>
              <span>
                {formatToBRL(shipment.financialCalc?.totalProductValue)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Frete</span>
              <span>{formatToBRL(0)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Impostos</span>
              <span>{formatToBRL(0)}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>
                {formatToBRL(shipment.financialCalc?.totalInvoiceValue)}
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
