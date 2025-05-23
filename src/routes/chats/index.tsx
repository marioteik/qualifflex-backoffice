import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";
import { useBackofficeRealTimeData } from "@/hooks/use-backoffice-real-time-data";
import queryKeyFactory from "@/lib/utils/query-key";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useChatStore } from "@/routes/chats/data/store";
import { ChatsSidebar } from "@/routes/chats/components/chat-sidebar";
import ShipmentDescription from "@/components/shipment-description";
import ChatForm from "./components/chat-form";
import { queryClient } from "@/query-client";
import { Room } from "@/schemas/room";
import type { ChatMessage } from "@/schemas/chat";
import { useGlobalStore } from "@/stores/global-store";
import { useChatRooms } from "@/api/chat-rooms";
import { useShipments } from "@/api/shipments";
import type { SelectShipment } from "@/schemas/shipments";

export default function Chats() {
  const { resetStore } = useChatStore();
  const location = useLocation();
  const room = useChatStore((state) => state.room);
  const setRoom = useChatStore((state) => state.setRoom);
  const { session } = useGlobalStore();

  useShipments();

  const { data: rooms } = useChatRooms();

  useBackofficeRealTimeData("chat", queryKeyFactory.chatRooms(), (data) => {
    const record = data as ChatMessage;

    if (session?.user.id === record.senderId) return;

    queryClient.setQueryData(queryKeyFactory.chatRooms(), (oldData: Room[]) => {
      if (!oldData) return [];

      return oldData.map((item) => {
        const isNew =
          useChatStore.getState().room?.shipmentId !== item.shipmentId;

        return item.shipmentId === record.shipmentId
          ? {
              ...item,
              chatMessages: [...item.chatMessages, record],
              isNew,
            }
          : item;
      });
    });
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
  });

  const handleNext = () => {
    const index = rooms.findIndex((r) => r.id === room?.id);

    if (index === rooms.length - 1) return;

    setRoom(rooms[index + 1]);
  };

  const handlePrev = () => {
    const index = rooms.findIndex((r) => r.id === room?.id);

    if (index === 0) return;

    setRoom(rooms[index - 1]);
  };

  useEffect(() => {
    resetStore(`${location.pathname}`.split("/").pop() as string);
  }, [location.pathname, resetStore]);

  return (
    <Card className="flex-1 max-h-[calc(100vh-5rem)] overflow-hidden">
      <CardHeader className="flex-col gap-1 flex justify-between">
        <CardTitle>Atendimentos</CardTitle>
        <CardDescription>
          Administre atendimentos a remessas e converse com os pontos de
          interesse.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-row px-0 border-t w-full">
        <ChatsSidebar />

        <section className="flex flex-1 flex-col max-h-[calc(100vh-11.375rem)] overflow-y-auto border-x max-w-screen-xl min-w-[23.25rem] basis-3/5">
          {room && <ChatForm />}
          {!room && (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
              Selecione um atendimento para ver o histórico de mensagens <br />
              ou adicione um novo atendimento no menu à direita.
            </div>
          )}
        </section>

        <div className="flex flex-1 flex-col justify-between shrink min-w-[34.125rem] h-[calc(100vh-11.5rem)] basis-2/5">
          {room?.shipment ? (
            <ShipmentDescription prev={handlePrev} next={handleNext} />
          ) : (
            <div className="flex-1"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
