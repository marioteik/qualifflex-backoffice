import { create } from "zustand";
import type { SelectDriverPosition, SelectRoute } from "@/schemas/routes";

interface DriverState {
  currentRoute: SelectRoute | null;
  setCurrentRoute: (route: SelectRoute | null) => void;

  drivers: SelectDriverPosition[];
  setDrivers: (driver: SelectDriverPosition) => void;

  detailRoute: SelectRoute | null;
  setDetailRoute: (detailRoute: SelectRoute | null) => void;
}

export const useDriverStore = create<DriverState>((set, get) => ({
  currentRoute: null,
  setCurrentRoute: (currentRoute) => set({ currentRoute }),

  drivers: [],
  setDrivers: (driver: SelectDriverPosition) =>
    set((state) => {
      const existingIndex = state.drivers.findIndex((d) => d.id === driver.id);

      if (existingIndex >= 0) {
        const updatedDrivers = [...state.drivers];
        updatedDrivers[existingIndex] = driver;
        return { drivers: updatedDrivers };
      }

      return { drivers: [...state.drivers, driver] };
    }),

  detailRoute: null,
  setDetailRoute: (detailRoute) => set({ detailRoute }),
}));
