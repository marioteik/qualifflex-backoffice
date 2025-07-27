import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OrdersToBuyTable from "./components/data-table";
import OrderToBuyDetailModal from "./components/order-to-buy-detail-modal";

export default function OrdersToBuy() {
  return (
    <>
      <Card>
        <CardHeader className="flex-col gap-1 flex justify-between">
          <CardTitle>Ordens de Compra</CardTitle>
          <CardDescription>
            Acompanhe as Ordens de Compra ativas.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <OrdersToBuyTable />
        </CardContent>
      </Card>

      <OrderToBuyDetailModal />
    </>
  );
} 