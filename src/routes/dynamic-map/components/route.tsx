import { useEffect, useState } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteProps {
  origin: LatLng;
  destination: LatLng;
}

export default function Route({ origin, destination }: RouteProps) {
  const map = useMap();
  const mapsLibrary = useMapsLibrary("routes");

  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);

  // The currently selected route
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // Initialize the DirectionsService & DirectionsRenderer
  useEffect(() => {
    if (!mapsLibrary || !map) return;
    setDirectionsService(new mapsLibrary.DirectionsService());
    setDirectionsRenderer(new mapsLibrary.DirectionsRenderer({ map }));
  }, [mapsLibrary, map]);

  // Request directions whenever origin/destination or directions service changes
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      })
      .catch((err) => {
        console.error("Error with DirectionsService.route:", err);
      });

    // Cleanup on unmount
    return () => directionsRenderer.setMap(null);
  }, [origin, destination, directionsService, directionsRenderer]);

  // If the user toggles which route is displayed, update the renderer
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  // If you want to display some UI with details:
  // return (
  //   <div className="directions">
  //     <h2>{selected.summary}</h2>
  //     <p>
  //       {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
  //     </p>
  //     <p>Distance: {leg.distance?.text}</p>
  //     <p>Duration: {leg.duration?.text}</p>
  //     <button onClick={() => setRouteIndex((idx) => (idx + 1) % routes.length)}>
  //       Next Route
  //     </button>
  //   </div>
  // );

  return null;
}
