import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { queryClient } from "@/query-client";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { fetchWithToken } from "@/lib/utils/fetch-with-token";
import apiClient from "@/api-client";
import { useGlobalStore } from "@/stores/global-store";
import { AxiosError } from "axios";
import { useShallow } from "zustand/react/shallow";
import { getApiUrl } from "@/lib/utils/api-url";

let timeout: NodeJS.Timeout;

export default function useLocationChangeMiddleware() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession, setRole } = useGlobalStore(
    useShallow((state) => ({
      setSession: state.setSession,
      setRole: state.setRole,
    }))
  );

  useEffect(() => {
    (async () => {
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.substring(1));

      if (hashParams.get("access_token")) {
        return;
      }

      try {
        const data = await queryClient.fetchQuery({
          queryKey: queryKeyFactory.verify(),
          queryFn: fetchWithToken(getApiUrl("/auth/verify")),
        });

        if ((data as { verify: boolean }).verify === false) {
          navigate("/auth/sign-out");
        }

        setRole(data?.role?.role ?? null);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error verifying session", error);

          const session = useGlobalStore.getState().session;

          try {
            if (session) {
              const data = await apiClient.post("/auth/refresh", {
                refreshToken: session.refresh_token,
              });

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
  }, [location.pathname, location.search, navigate, setSession, setRole]);
}
