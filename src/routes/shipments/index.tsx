import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBackofficeRealTimeData } from "@/hooks/use-backoffice-real-time-data";
import queryKeyFactory from "@/lib/utils/query-key";
import ShipmentDetailModal from "./components/shipment-detail-modal";
import { useEffect, useMemo } from "react";
import { useShipmentsStore } from "./data/store";
import { useLocation } from "react-router-dom";

export default function Shipments() {
  const { resetStore } = useShipmentsStore();
  const location = useLocation();

  useBackofficeRealTimeData("shipment", queryKeyFactory.shipments());

  useEffect(() => {
    resetStore(location.pathname.split("/").pop() as string);
  }, [location.pathname, resetStore]);

  // Filter columns based on current route
  const filteredColumns = useMemo(() => {
    const isPendingApprovalRoute =
      location.pathname.includes("/pending-approval");

    if (isPendingApprovalRoute) {
      // Show all columns including informedEstimation for pending-approval route
      return columns;
    } else {
      // Hide informedEstimation column for other routes
      return columns.filter((column) => {
        const accessorKey = "accessorKey" in column ? column.accessorKey : null;
        return accessorKey !== "informedEstimation";
      });
    }
  }, [location.pathname]);

  return (
    <>
      <Card>
        <CardHeader className="flex-col gap-1 flex justify-between">
          <CardTitle>Gerenciamento de Remessas</CardTitle>
          <CardDescription>
            Administre remessas e acompanhe seus status e estatísticas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <DataTable columns={filteredColumns} />
        </CardContent>
      </Card>

      <ShipmentDetailModal />
    </>
  );
}
