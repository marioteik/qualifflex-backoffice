import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import RoomForm from "./room-form";
import { useEffect, useState } from "react";
import { useChatRooms } from "@/api/chat-rooms";
import { useChatStore } from "@/routes/chats/data/store";
import type { Room } from "@/schemas/room";
import { queryClient } from "@/query-client";
import queryKeyFactory from "@/lib/utils/query-key";
import type { SelectShipment } from "@/schemas/shipments";

export function ChatsSidebar() {
  const [isPopoverOpen, setOpenPopover] = useState<boolean>(false);
  const setRoom = useChatStore((state) => state.setRoom);
  const room = useChatStore((state) => state.room);

  const { data: rooms } = useChatRooms();

  useEffect(() => {
    const _room = rooms.find((item) => item.id === room?.id);

    if (
      _room &&
      room &&
      room.chatMessages?.length !== _room.chatMessages?.length
    ) {
      setRoom(_room);
    }
  }, [room, room?.chatMessages?.length, room?.id, rooms, setRoom]);

  const handleSetRoom = (item: Room) => {
    setRoom(item);

    queryClient.setQueryData(queryKeyFactory.chatRooms(), (rooms: Room[]) => {
      return rooms.map((r) => {
        if (r.id === item.id) {
          return { ...r, isNew: false };
        }

        return r;
      });
    });
  };

  return (
    <Sidebar
      collapsible="none"
      key="chat-sidebar"
      className="basis-1/5 min-w-60 max-w-60"
    >
      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="border-b rounded-none">
                <Popover open={isPopoverOpen} onOpenChange={setOpenPopover}>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        buttonVariants({
                          variant: "default",
                        }),
                        "rounded-none hover:text-primary-foreground/80 !p-2 h-14"
                      )}
                    >
                      Adicionar Atendimento
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-[350px]">
                    <RoomForm
                      onClose={() => {
                        setOpenPopover(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
              {rooms.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  className={cn(
                    "border-b rounded-none",
                    item.isNew && "bg-green-50"
                  )}
                >
                  <SidebarMenuButton
                    onClick={() => handleSetRoom(item)}
                    className="px-2 py-3 h-auto rounded-none -mt-1"
                    isActive={room?.id === item.id}
                  >
                    N.º {item.shipment.number} &#183; {item.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
