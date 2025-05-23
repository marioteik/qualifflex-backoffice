import Route from "@/routes/dynamic-map/components/route";

const center = { lat: -23.602843, lng: -46.5929348 };

import { Map } from "@vis.gl/react-google-maps";
import { useDriverStore } from "@/routes/dynamic-map/data/store";

export default function DriversMap() {
  const { drivers } = useDriverStore();

  return (
    <div className="w-full h-full">
      <Map
        defaultCenter={center}
        defaultZoom={9}
        gestureHandling="greedy"
        fullscreenControl={false}
      >
        {drivers.flatMap((driver) =>
          driver.stops.map((stop, index) => (
            <Route
              key={`${driver.id}-${stop.id}`}
              origin={index === 0 ? center : driver.stops[index - 1].location}
              destination={stop.location}
            />
          )),
        )}
      </Map>
    </div>
  );
}
