import {
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const DriverMark = (props: {
  name?: string;
  location: google.maps.LatLngLiteral;
}) => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const renderMarker = useMemo(() => {
    return (
      <div
        className={cn(
          "transition-all scale-100 flex-row flex justify-between items-center py-1 pr-2 bg-white text-black/80 rounded",
          hovered && "scale-125",
          clicked && "scale-150",
        )}
      >
        <div className="text-primary relative flex justify-center items-center w-10 h-9">
          <MapPin className="stroke-primary fill-primary size-10 absolute z-0" />
          <Truck className="stroke-primary-foreground z-10 mb-1" size={20} />
        </div>
        <span className="font-medium text-xs">{props.name}</span>
      </div>
    );
  }, [clicked, hovered, props.name]);

  return (
    <AdvancedMarker
      position={props.location}
      title={"Driver position"}
      onClick={() => setClicked(!clicked)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {renderMarker}
    </AdvancedMarker>
  );
};

export default function Directions({
  origin,
  destination,
  name,
  onDirectionsChanged,
}: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  name?: string;
  onDirectionsChanged: () => void;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;

    const service = new routesLibrary.DirectionsService();
    const renderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: "#19506c",
        strokeOpacity: 1,
      },
    });

    setDirectionsService(service);
    setDirectionsRenderer(renderer);

    return () => {
      if (renderer) {
        renderer.setMap(null);
        google.maps.event.clearInstanceListeners(renderer);
      }
    };
  }, [routesLibrary, map]);

  // Handle directions requests
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    // Validate coordinates
    const isValidRequest =
      origin?.lat &&
      typeof origin.lat === "number" &&
      origin?.lng &&
      typeof origin.lng === "number" &&
      destination?.lat &&
      typeof destination.lat === "number" &&
      destination?.lng &&
      typeof destination.lng === "number";

    if (!isValidRequest) {
      console.warn("Invalid coordinates:", { origin, destination });
      return;
    }

    // Convert to LatLng objects
    const originLatLng = new google.maps.LatLng(origin.lat, origin.lng);
    const destLatLng = new google.maps.LatLng(destination.lat, destination.lng);

    directionsService.route(
      {
        origin: originLatLng,
        destination: destLatLng,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          setRoutes(response!.routes);
        } else {
          console.error("Directions request failed:", status);
          directionsRenderer.setDirections(null);
        }
      },
    );

    // Add directions changed listener
    const listener = directionsRenderer.addListener(
      "directions_changed",
      () => {
        onDirectionsChanged?.();
      },
    );

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [directionsService, directionsRenderer, origin, destination]);

  return <DriverMark name={name} location={origin} />;
}
