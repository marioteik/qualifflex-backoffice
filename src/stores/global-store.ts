import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { createJSONStorage, persist } from "zustand/middleware";

export type GlobalStore = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  theme: "dark" | "light" | "system";
  setTheme: (theme: "dark" | "light" | "system") => void;
};

export function destroySession() {
  localStorage.removeItem("session");
  useGlobalStore.getState().setSession(null);
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme: "dark" | "light" | "system") => set(() => ({ theme })),
      session: null,
      setSession: (session: Session | null) => set(() => ({ session })),
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, session: state.session }),
    },
  ),
);
