import { create } from "zustand";
import type { PushNotification } from "@/schemas/push-notifications";

interface PushNotificationsStore {
  selectedNotification: PushNotification | null;
  setSelectedNotification: (notification: PushNotification | null) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  resetStore: () => void;
}

export const usePushNotificationsStore = create<PushNotificationsStore>((set) => ({
  selectedNotification: null,
  setSelectedNotification: (notification) => set({ selectedNotification: notification }),
  isDetailModalOpen: false,
  setIsDetailModalOpen: (open) => set({ isDetailModalOpen: open }),
  resetStore: () =>
    set({
      selectedNotification: null,
      isDetailModalOpen: false,
    }),
}));