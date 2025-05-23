import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import persistentStorage from "@/stores/persist-storage";
import type { Room } from "@/schemas/room";

interface State {
  room: Room | null;
  setRoom: (shipment: Room | null) => void;

  resetStore: (path: string) => void;
}

type InitialState = Omit<State, "setRoom" | "resetStore">;

const initialState: InitialState = {
  room: null,
};

export const useChatStore = create<State>()(
  devtools(
    (set) => ({
      ...initialState,

      setRoom: (room) => set({ room }),

      resetStore: () => {
        const _initialState: InitialState = { ...initialState };

        set({ ..._initialState });
      },
    }),
    {
      name: "chat-store",
    }
  )
);
