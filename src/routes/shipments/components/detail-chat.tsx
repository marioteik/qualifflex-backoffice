import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { type ChatMessage, chatMessageSchema } from "@/schemas/chat";
import { useGlobalStore } from "@/stores/global-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, differenceInMinutes, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSendMessage, useChatRooms, useCreateRoom } from "@/api/chat-rooms";
import { useEffect, useRef } from "react";
import { SelectShipment } from "@/schemas/shipments";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

// Helper function to group messages by day, then by 3-minute intervals
function groupByDayAndInterval(messages: ChatMessage[]) {
  // Sort messages chronologically by createdAt
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const groupedByDay: Array<{
    dayLabel: Date; // The actual Date object for that day
    groups: Array<{
      senderId: string | undefined;
      messages: ChatMessage[];
    }>;
  }> = [];

  let currentDayGroup: {
    dayLabel: Date;
    groups: Array<{
      senderId: string | undefined;
      messages: ChatMessage[];
    }>;
  } | null = null;

  sorted.forEach((message) => {
    const messageDate =
      typeof message.createdAt === "string"
        ? parseISO(message.createdAt)
        : message.createdAt;

    // Check if we're still on the same day
    if (!currentDayGroup || !isSameDay(currentDayGroup.dayLabel, messageDate)) {
      // Start a new day group
      currentDayGroup = {
        dayLabel: messageDate,
        groups: [],
      };
      groupedByDay.push(currentDayGroup);
    }

    // Reference to the last group inside the current day
    const dayGroups = currentDayGroup.groups;
    let lastGroup = dayGroups[dayGroups.length - 1];

    if (!lastGroup) {
      // No group yet, create the first one
      lastGroup = {
        senderId: message.senderId,
        messages: [message],
      };
      dayGroups.push(lastGroup);
    } else {
      // Compare the new message to the last one in the current group
      const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];
      const lastMessageDate =
        typeof lastMessage.createdAt === "string"
          ? parseISO(lastMessage.createdAt)
          : lastMessage.createdAt;

      const minutesDiff = differenceInMinutes(messageDate, lastMessageDate);

      // If same sender && within 3 minutes, push to existing group
      if (lastGroup.senderId === message.senderId && minutesDiff <= 3) {
        lastGroup.messages.push(message);
      } else {
        // Otherwise, start a new group for this day
        dayGroups.push({
          senderId: message.senderId,
          messages: [message],
        });
      }
    }
  });

  return groupedByDay;
}

export default function ShipmentDetailChat({
  shipment,
}: {
  shipment: SelectShipment;
}) {
  const session = useGlobalStore((state) => state.session);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: rooms, isLoading } = useChatRooms();
  const room = rooms?.find((r) => r.shipmentId === shipment.id);
  const createRoomMutation = useCreateRoom();

  const form = useForm<ChatMessage>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      senderName: session?.user.email,
      senderId: session?.user.id,
      shipmentId: shipment.id,
      message: "",
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    },
  });

  const { reset, register } = form;

  const { mutate } = useSendMessage(shipment.id);

  const onSubmit = (data: ChatMessage) => {
    mutate(data, {
      onSuccess() {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        reset();
      },
    });
  };

  // Create room if it doesn't exist
  useEffect(() => {
    if (!isLoading && !room && shipment.id) {
      createRoomMutation.mutate({
        shipmentId: shipment.id,
      });
    }
  }, [isLoading, room, shipment.id, createRoomMutation]);

  const groupedByDay = groupByDayAndInterval(room?.chatMessages || []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    reset();
  }, [reset, room]);

  console.log("Chat component rendering:", {
    shipment,
    rooms,
    room,
    isLoading,
  });

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Carregando chat...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="bg-blue-100 p-4 border-2 border-blue-500">
      <h2 className="text-lg font-bold text-blue-800 mb-4">
        🔧 CHAT DEBUG MODE
      </h2>
      <p>Shipment ID: {shipment.id}</p>
      <p>Rooms loaded: {rooms?.length || 0}</p>
      <p>Current room: {room ? "Found" : "Not found"}</p>
      <p>Is loading: {isLoading ? "Yes" : "No"}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 h-[calc(100vh-18rem)] pb-4 relative">
            {/* Chat content area */}
            <div
              className="flex-1 flex flex-col justify-start items-stretch overflow-y-auto px-4 mb-[60px]"
              ref={containerRef}
            >
              {!room?.chatMessages || room?.chatMessages?.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center self-center justify-self-center">
                    Nenhuma mensagem foi enviada para esse chat, inicie uma
                    conversa sobre a remessa.
                  </p>
                </div>
              ) : (
                <>
                  {/* Render each day */}
                  {groupedByDay.map((dayGroup, groupIdx) => {
                    const dayLabel = format(dayGroup.dayLabel, "PPP", {
                      locale: ptBR,
                    });

                    return (
                      <div key={`${dayLabel}-${groupIdx}`} className="w-full">
                        {/* Date separator */}
                        <div className="text-center text-sm text-muted-foreground my-2 mt-8">
                          {dayLabel}
                        </div>

                        {/* Render each group within the day */}
                        {dayGroup.groups.map((group, subGroupIdx) => (
                          <div
                            key={`${dayLabel}-${groupIdx}-${subGroupIdx}`}
                            className="w-full"
                          >
                            {group.messages.map((msg, msgIdx) => {
                              const isLastInGroup =
                                msgIdx === group.messages.length - 1;
                              // Format the message time
                              const msgTime = format(
                                typeof msg.createdAt === "string"
                                  ? parseISO(msg.createdAt)
                                  : msg.createdAt,
                                "HH:mm",
                                {
                                  locale: ptBR,
                                }
                              );

                              if (msg.senderId !== session?.user.id) {
                                return (
                                  <div
                                    key={msg.id}
                                    className="flex gap-2 self-start items-start mb-2"
                                  >
                                    {msgIdx === 0 ? (
                                      <div className="w-8 h-8 bg-muted rounded-full"></div>
                                    ) : (
                                      <div className="w-8 h-8 min-w-8"></div>
                                    )}

                                    <div className="flex flex-col min-w-[200px] bg-muted rounded-2xl p-2">
                                      <div className="text-[0.6125rem]">
                                        {msg.senderName}
                                      </div>
                                      <div>{msg.message}</div>
                                    </div>

                                    {isLastInGroup && (
                                      <div className="text-right text-xs mt-1 self-end">
                                        {msgTime}
                                      </div>
                                    )}
                                  </div>
                                );
                              }

                              // Otherwise, align the message to the right
                              return (
                                <div
                                  key={msg.id}
                                  className="flex gap-2 self-end items-end mb-2 justify-end"
                                >
                                  {isLastInGroup && (
                                    <div className="text-right text-xs mt-1">
                                      {msgTime}
                                    </div>
                                  )}

                                  <div className="flex flex-col min-w-[200px] bg-primary/30 rounded-2xl p-2">
                                    <div className="text-[0.6125rem]">
                                      {msg.senderName}
                                    </div>
                                    <div>{msg.message}</div>
                                  </div>

                                  {msgIdx === 0 ? (
                                    <div className="w-8 h-8 bg-primary/30 rounded-full self-start"></div>
                                  ) : (
                                    <div className="w-8 h-8 min-w-8 basis-8"></div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Input area */}
            <div className="flex flex-row gap-4 absolute bottom-4 left-0 w-full px-4">
              <Input
                {...register("message")}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button type="submit">Enviar</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
