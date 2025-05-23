import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  AdvancedMarkerProps,
  CollisionBehavior,
  Map,
  useAdvancedMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import type { DriverList, SelectDriverPosition } from "@/schemas/routes"; // Adapt to your type location
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Directions from "@/components/atoms/route";
import { MapPin, Volleyball } from "lucide-react";
import { useShipments } from "@/api/shipments";

const center = { lat: -23.602843, lng: -46.5929348 };

export default function DriversMap({
  routes,
  drivers,
}: {
  routes?: DriverList;
  drivers: SelectDriverPosition[];
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const { data: shipments } = useShipments();
  const map = useMap();

  const timeoutRef = useRef<NodeJS.Timeout>();

  const renderCustomPin = useCallback(() => {
    return (
      <>
        <div className="w-5 h-5">
          <Button className="close-button">
            <span className="material-symbols-outlined">close</span>
          </Button>
        </div>
      </>
    );
  }, []);

  const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  const onMarkerClick = useCallback(
    (id: string | null, marker?: google.maps.marker.AdvancedMarkerElement) => {
      setSelectedId(id);

      if (marker) {
        setSelectedMarker(marker);
      }

      if (id !== selectedId) {
        setInfoWindowShown(true);
      } else {
        setInfoWindowShown((isShown) => !isShown);
      }
    },
    [selectedId]
  );

  const onMapClick = useCallback(() => {
    setSelectedId(null);
    setSelectedMarker(null);
    setInfoWindowShown(false);
  }, []);

  const handleDirectionChanged = useCallback(() => {
    if (!map) return;

    // Debounce to handle multiple direction changes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();

      drivers.forEach((driver) => {
        // Add driver's current position
        const originLat = Number(driver.lat ?? center.lat);
        const originLng = Number(driver.lng ?? center.lng);
        bounds.extend(new google.maps.LatLng(originLat, originLng));

        // Add driver's destination from routes
        const driverRoute = routes
          ?.find((route) => route.driver?.id === driver.driverId)
          ?.routes.find((item) => !!item.startTime && !item.endTime);

        if (driverRoute?.location) {
          const destLat = Number(driverRoute.location.lat);
          const destLng = Number(driverRoute.location.lng);
          bounds.extend(new google.maps.LatLng(destLat, destLng));
        }
      });

      // Only fit bounds if we have valid points
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          top: 100, // Padding in pixels
          bottom: 100,
          left: 100,
          right: 100,
        });
      }
    }, 500);
  }, [drivers, routes, map]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <Map
        mapId={"bf51a910020fa25a"}
        defaultCenter={center}
        defaultZoom={9}
        gestureHandling="greedy"
        fullscreenControl={false}
        onClick={onMapClick}
        clickableIcons={false}
        disableDefaultUI
      >
        {routes?.map((route, index) => (
          <Fragment key={index}>
            {route.routes.map((r, i) => {
              const zIndex = i;
              const id = r.shipmentId;
              const shipment = shipments?.find((item) => item.id === id);
              const contact =
                shipment?.recipient.businessInfo.contact?.trim() ||
                shipment?.recipient.businessInfo.tradeName?.trim() ||
                shipment?.recipient.businessInfo.nameCorporateReason.trim();

              return (
                <Fragment key={i}>
                  <AdvancedMarkerWithRef
                    position={{
                      lat: Number(r.location!.lat),
                      lng: Number(r.location!.lng),
                    }}
                    zIndex={zIndex}
                    anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
                    className="transition-all duration-200 ease-in-out"
                    style={{
                      transform: `scale(${
                        [hoverId, selectedId].includes(id) ? 1.3 : 1
                      })`,
                      transformOrigin:
                        AdvancedMarkerAnchorPoint.TOP_CENTER.join(" "),
                    }}
                    onMarkerClick={(
                      marker: google.maps.marker.AdvancedMarkerElement
                    ) => onMarkerClick(id, marker)}
                    onMouseEnter={() => onMouseEnter(id)}
                    collisionBehavior={
                      CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL
                    }
                    onMouseLeave={onMouseLeave}
                  >
                    <div
                      className={cn(
                        "transition-all duration-200 ease-in-out flex-row flex justify-between items-center text-black/80 rounded",
                        selectedId === id && "scale-125",
                        (hoverId === id || selectedId === id) &&
                          "bg-white py-1 pr-2 -mt-10"
                      )}
                    >
                      <div className="text-primary relative flex justify-center items-center w-10 h-9">
                        <MapPin className="stroke-primary fill-primary size-10 absolute z-0" />
                        <Volleyball
                          className="stroke-primary-foreground z-10 mb-1"
                          size={20}
                        />
                      </div>
                      {(hoverId === id || selectedId === id) && (
                        <span className="font-medium text-xs">{contact}</span>
                      )}
                    </div>
                  </AdvancedMarkerWithRef>

                  <AdvancedMarkerWithRef
                    onMarkerClick={(
                      marker: google.maps.marker.AdvancedMarkerElement
                    ) => onMarkerClick(id, marker)}
                    zIndex={zIndex + 1}
                    onMouseEnter={() => onMouseEnter(id)}
                    onMouseLeave={onMouseLeave}
                    anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                    position={{
                      lat: Number(r.location!.lat),
                      lng: Number(r.location!.lng),
                    }}
                  >
                    <div className="w-[8px] h-[8px] bg-[#ffa700] border border-[#0057e7] rounded-full" />
                  </AdvancedMarkerWithRef>
                </Fragment>
              );
            })}
          </Fragment>
        ))}

        {drivers.map((driver) => {
          const driverRoute = routes
            ?.find((route) => route.driver?.id === driver.driverId)
            ?.routes.find((item) => !!item.startTime && !item.endTime);

          const driverName = routes?.find(
            (route) => route.driver?.id === driver.driverId
          )?.driver?.name;

          return (
            <Directions
              key={driver.id}
              name={driverName}
              onDirectionsChanged={handleDirectionChanged}
              origin={{
                lat: Number(driver.lat ?? center.lat),
                lng: Number(driver.lng ?? center.lng),
              }}
              destination={{
                lat: Number(driverRoute?.location?.lat ?? center.lat),
                lng: Number(driverRoute?.location?.lng ?? center.lng),
              }}
            />
          );
        })}
      </Map>
    </div>
  );
}

export const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  }
) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};
