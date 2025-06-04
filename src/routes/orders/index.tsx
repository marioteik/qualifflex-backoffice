import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OrdersTable from "./components/data-table";

export default function Orders() {
  return (
    <Card>
      <CardHeader className="flex-col gap-1 flex justify-between">
        <CardTitle>Ordens de Produção</CardTitle>
        <CardDescription>
          Acompanhe as Ordens de Produção ativas.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <OrdersTable />
      </CardContent>
    </Card>
  );
}
