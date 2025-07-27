import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import {
  deleteWithToken,
  fetchWithToken,
  postWithToken,
} from "@/lib/utils/fetch-with-token";
import { handleSettledMutation } from "@/lib/utils/handle-optimistic-mutation";
import type { QueryOptions } from "../../types/query-options";
import type { Room } from "@/schemas/room";

const route = "/api/chat-rooms";

export function useChatRooms() {
  return useQuery({
    queryKey: queryKeyFactory.chatRooms(),
    queryFn: async () => {
      const rooms = await fetchWithToken<Room[]>(route)();

      const newRoomsState = JSON.parse(
        localStorage.getItem("chatRoomsNewState") || "{}"
      );

      return rooms.map((room) => ({
        ...room,
        isNew: newRoomsState[room.shipmentId] || false,
      }));
    },
    initialData: [],
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateRoom(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.chatRooms(),
    mutationFn: postWithToken(route),
    ...handleSettledMutation(queryKeyFactory.chatRooms()),
    ...options,
  });
}

export function useSendMessage(shipmentId: string, options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.chatRoomMessages(),
    mutationFn: postWithToken(route + "/" + shipmentId),
    ...options,
  });
}

export function useDeleteShipment(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.shipments(),
    mutationFn: deleteWithToken(route),
    ...handleSettledMutation(queryKeyFactory.shipments()),
    ...options,
  });
}
