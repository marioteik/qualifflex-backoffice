import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import useLocationChangeMiddleware from "@/hooks/use-location-change-middleware";
import { usePreferredTheme } from "@/hooks/use-preferred-theme";
import { useGlobalStore } from "@/stores/global-store";

export default function Providers({ children }: { children: ReactNode }) {
  const theme = useGlobalStore((state) => state.theme);

  useLocationChangeMiddleware();
  usePreferredTheme();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors theme={theme} />
    </QueryClientProvider>
  );
}
