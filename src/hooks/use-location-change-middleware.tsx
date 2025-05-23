import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { queryClient } from "@/query-client";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { fetchWithToken } from "@/lib/utils/fetch-with-token";
import apiClient from "@/api-client";
import { useGlobalStore } from "@/stores/global-store";
import { AxiosError } from "axios";
import { useShallow } from "zustand/react/shallow";

let timeout: NodeJS.Timeout;

export default function useLocationChangeMiddleware() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, setSession } = useGlobalStore(
    useShallow((state) => ({
      session: state.session,
      setSession: state.setSession,
    }))
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await queryClient.fetchQuery({
          queryKey: queryKeyFactory.verify(),
          queryFn: fetchWithToken(
            import.meta.env.VITE_API_DOMAIN + "/api/auth/verify"
          ),
        });

        if ((data as { verify: boolean }).verify === false) {
          navigate("/auth/sign-out");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error verifying session", error);

          try {
            if (session) {
              const data = await apiClient.post(
                import.meta.env.VITE_API_DOMAIN + "/api/auth/refresh",
                {
                  refreshToken: session.refresh_token,
                }
              );

              return setSession(data.data.session);
            }
          } catch (error) {
            console.error("Error refreshing session", error);
          }

          navigate("/auth/sign-out");
        }
      }
    })();

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      if (!window.location.pathname.includes("auth")) {
        localStorage.setItem(
          "current-location",
          window.location.pathname + window.location.search
        );
      }
    }, 300);
  }, [location.pathname, location.search, navigate, session, setSession]);
}
