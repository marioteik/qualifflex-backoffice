import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useShipmentsStore } from "@/routes/shipments/data/store";
import { useBackofficeRealTimeData } from "@/hooks/use-backoffice-real-time-data";
import queryKeyFactory from "@/lib/utils/query-key";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Shipments() {
  const { resetStore } = useShipmentsStore();
  const location = useLocation();

  useBackofficeRealTimeData("shipment", queryKeyFactory.shipments());

  useEffect(() => {
    resetStore(`${location.pathname}`.split("/").pop() as string);
  }, []);

  return (
    <Card>
      <CardHeader className="flex-col gap-1 flex justify-between">
        <CardTitle>Gerenciamento de Remessas</CardTitle>
        <CardDescription>
          Administre remessas e acompanhe seus status e estatísticas.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <DataTable columns={columns} />
      </CardContent>
    </Card>
  );
}
