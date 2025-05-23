import React from "react";
import { useDriverStore } from "@/routes/dynamic-map/data/store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DetailPanel: React.FC = () => {
  const { drivers, markStopAsPickedUp } = useDriverStore();

  return (
    <div className="w-full h-full overflow-y-auto px-6">
      <Tabs>
        <TabsList>
          <TabsTrigger value="romaneio">Pedidos para Romaneio</TabsTrigger>
          <TabsTrigger>Motorista 1</TabsTrigger>
          <TabsTrigger>Motorista 2</TabsTrigger>
        </TabsList>
      </Tabs>
      {/*{drivers.map((driver) => (*/}
      {/*  <div key={driver.id} className="mb-6 border-b pb-4">*/}
      {/*    <h3 className="font-semibold text-lg mb-2">{driver.name}</h3>*/}
      {/*    <ul className="space-y-2">*/}
      {/*      {driver.stops.map((stop) => (*/}
      {/*        <li key={stop.id} className="flex items-center justify-between">*/}
      {/*          <div>*/}
      {/*            <div className="text-sm font-medium">*/}
      {/*              Address: {stop.address}*/}
      {/*            </div>*/}
      {/*            <div className="text-xs text-gray-600">*/}
      {/*              Status: {stop.status}*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          {stop.status !== "PICKED_UP" && (*/}
      {/*            <button*/}
      {/*              className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"*/}
      {/*              onClick={() => markStopAsPickedUp(driver.id, stop.id)}*/}
      {/*            >*/}
      {/*              Picked Up*/}
      {/*            </button>*/}
      {/*          )}*/}
      {/*        </li>*/}
      {/*      ))}*/}
      {/*    </ul>*/}
      {/*  </div>*/}
      {/*))}*/}
    </div>
  );
};

export default DetailPanel;
