import React from "react";
import DriverMap from "./components/map";
import DetailPanel from "./components/detail";
import { APIProvider } from "@vis.gl/react-google-maps";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRoutes } from "@/api/routes";
import { useBackofficeRealTimeData } from "@/hooks/use-backoffice-real-time-data";
import queryKeyFactory from "@/lib/utils/query-key";
import { queryClient } from "@/query-client";
import type {
  DriverList,
  SelectDriverPosition,
  SelectRoute,
} from "@/schemas/routes";
import { useDriversPositions } from "@/api/drivers";

function LoadList() {
  const { data: routes } = useRoutes();
  const { data: drivers } = useDriversPositions();

  useBackofficeRealTimeData("route", queryKeyFactory.routes(), (data) => {
    const record = data as SelectRoute;

    queryClient.setQueryData(
      queryKeyFactory.routes(),
      (oldData: DriverList) => {
        if (!oldData) return [];

        return oldData.map((item) => {
          if (item.driver?.id === record.driverId) {
            return {
              ...item,
              routes: item.routes.map((r) => (r.id === record.id ? record : r)),
            };
          }

          return item;
        });
      }
    );
  });

  useBackofficeRealTimeData(
    "driver",
    queryKeyFactory.driversPositions(),
    (data) => {
      const record = data as SelectDriverPosition;

      queryClient.setQueryData(
        queryKeyFactory.driversPositions(),
        (oldData: SelectDriverPosition[]) => {
          if (!oldData) return [record];

          const existingIndex = oldData.findIndex(
            (d) => d.driverId === record.driverId
          );

          if (existingIndex > -1) {
            const newData = [...oldData];
            newData[existingIndex] = {
              ...newData[existingIndex],
              ...record,
            };
            return newData;
          }

          return [...oldData, record];
        }
      );
    }
  );

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["marker"]}
    >
      <Card className="flex flex-col flex-1 h-full">
        <CardHeader className="flex-col gap-1 flex justify-between shrink-0">
          <CardTitle>Romaneio</CardTitle>
          <CardDescription>
            Visualize as remessas, crie rotas de entrega e designe a remessa a
            um motoristas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex gap-6 overflow-hidden">
          <div className="flex-1 relative border border-foreground/20 rounded-xl overflow-hidden shadow-sm focused:hidden">
            <DriverMap routes={routes} drivers={drivers} />
          </div>
          <div className="shrink-0 w-[38rem]">
            <DetailPanel />
          </div>
        </CardContent>
      </Card>
    </APIProvider>
  );
}

export default LoadList;
