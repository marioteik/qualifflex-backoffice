import React from "react";
import { Driver } from "@/schemas/driver";
import DriverMap from "./components/map";
import DetailPanel from "@/routes/dynamic-map/components/detail";
import { APIProvider } from "@vis.gl/react-google-maps";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DynamicMap() {
  // const { setDrivers } = useDriverStore();

  // useEffect(() => {
  //   const validatedDrivers: Driver[] = sampleData.map((rawDriver) => {
  //     const parsed = driverSchema.parse({
  //       ...rawDriver,
  //       stops: rawDriver.stops.map((rawStop) => stopSchema.parse(rawStop)),
  //     });
  //     return parsed;
  //   });
  //
  //   setDrivers(validatedDrivers);
  // }, [setDrivers]);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Card className="flex flex-col flex-1 h-full">
        <CardHeader className="flex-col gap-1 flex justify-between shrink-0">
          <CardTitle>Mapa Dinâmico</CardTitle>
          <CardDescription>
            Acompanhe em tempo real a rota dos motoristas e suas entregas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative">
            <DriverMap />
          </div>
          <div className="shrink-0 w-80 bg-gray-100 border-l border-gray-300">
            <DetailPanel />
          </div>
        </CardContent>
      </Card>
    </APIProvider>
  );
}

export default DynamicMap;
