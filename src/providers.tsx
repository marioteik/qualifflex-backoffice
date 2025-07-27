import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import useLocationChangeMiddleware from "@/hooks/use-location-change-middleware";
import { usePreferredTheme } from "@/hooks/use-preferred-theme";
import { useGlobalStore } from "@/stores/global-store";
import { useBackofficeRealTimeData } from "./hooks/use-backoffice-real-time-data";
import queryKeyFactory from "./lib/utils/query-key";
import { ChatMessage } from "./schemas/chat";
import { Room } from "./schemas/room";
import { SelectShipment } from "./schemas/shipments";

export default function Providers({ children }: { children: ReactNode }) {
  const theme = useGlobalStore((state) => state.theme);

  useLocationChangeMiddleware();
  usePreferredTheme();

  useBackofficeRealTimeData("chat", queryKeyFactory.chatRooms(), (data) => {
    const record = data as ChatMessage;

    queryClient.setQueryData(queryKeyFactory.chatRooms(), (oldData: Room[]) => {
      if (!oldData) return [];

      return oldData.map((item) => {
        return item.shipmentId === record.shipmentId
          ? {
              ...item,
              chatMessages: [...item.chatMessages, record],
              isNew: true,
            }
          : item;
      });
    });

    const newRoomsState = JSON.parse(
      localStorage.getItem("chatRoomsNewState") || "{}"
    );
    newRoomsState[record.shipmentId] = true;
    localStorage.setItem("chatRoomsNewState", JSON.stringify(newRoomsState));
  });

  useBackofficeRealTimeData("rooms", queryKeyFactory.chatRooms(), (data) => {
    const room = data as Room;

    queryClient.setQueryData(queryKeyFactory.chatRooms(), (oldData: Room[]) => {
      if (!oldData) return [];

      const _shipments = queryClient.getQueryData(
        queryKeyFactory.shipments()
      ) as SelectShipment[];

      return [
        ...oldData,
        {
          ...room,
          chatMessages: [],
          shipment: _shipments.find((s) => s.id === room.shipmentId),
          isNew: true,
        },
      ];
    });

    const newRoomsState = JSON.parse(
      localStorage.getItem("chatRoomsNewState") || "{}"
    );
    newRoomsState[room.shipmentId] = true;
    localStorage.setItem("chatRoomsNewState", JSON.stringify(newRoomsState));
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors theme={theme} />
    </QueryClientProvider>
  );
}
