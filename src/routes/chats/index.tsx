import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useChatStore } from "@/routes/chats/data/store";
import { ChatsSidebar } from "@/routes/chats/components/chat-sidebar";
import ShipmentDescription from "@/components/shipment-description";
import ChatForm from "./components/chat-form";
import { useChatRooms } from "@/api/chat-rooms";
import { useShipments } from "@/api/shipments";

export default function Chats() {
  const { resetStore } = useChatStore();
  const location = useLocation();
  const room = useChatStore((state) => state.room);
  const setRoom = useChatStore((state) => state.setRoom);

  useShipments();

  const { data: rooms } = useChatRooms();

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
