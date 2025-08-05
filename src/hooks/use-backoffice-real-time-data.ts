import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useGlobalStore } from "@/stores/global-store";
import { queryClient } from "@/query-client";
import type { QueryKey } from "@tanstack/react-query";

export function useBackofficeRealTimeData(
  entity: "chat" | "shipment" | "rooms" | "route" | "driver",
  queryKey: QueryKey,
  handleUpdate?: (data: unknown) => void
) {
  const session = useGlobalStore((state) => state.session);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const apiDomain = import.meta.env.VITE_API_DOMAIN || "";

    console.log(
      `🔌 WebSocket connecting to: ${apiDomain}/api/backoffice-updates`
    );

    const updates = io(apiDomain + "/api/backoffice-updates", {
      auth: {
        token: session?.access_token,
      },
      transports: ["websocket"],
      path: "/socket.io",
    });

    updates.on("connect", () => {
      console.log("Connected to " + entity + " updates");
    });

    updates.on(entity + ":update", (data) => {
      if (handleUpdate) {
        return handleUpdate(data);
      }

      queryClient.setQueryData([...queryKey, data.id], (oldData: unknown) => {
        if (!oldData) return data;
        return {
          ...oldData,
          ...data,
        };
      });

      queryClient.setQueryData(queryKey, (oldData: unknown) => {
        if (!oldData) return [data];

        return oldData.map((item: unknown) =>
          item.id === data.id ? data : item
        );
      });
    });

    socketRef.current = updates;

    return () => {
      updates.disconnect();
      socketRef.current = null;
    };
  }, [entity, session?.access_token, queryKey, handleUpdate]);
}
