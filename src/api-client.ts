import axios from "axios";
import { AuthResponse } from "@supabase/supabase-js";
import { useGlobalStore } from "@/stores/global-store";
import { isBefore, subMinutes } from "date-fns";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
});

const refreshEndpoint = "/api/auth/refresh";

const refreshToken = async () => {
  const session = useGlobalStore.getState().session;

  try {
    const refreshResponse = await apiClient.post<AuthResponse["data"]>(
      refreshEndpoint,
      {
        refresh_token: session?.refresh_token,
      }
    );

    const newToken = refreshResponse.data.session?.access_token;

    if (!newToken) {
      throw new Error("No token came back from the request");
    }

    useGlobalStore.getState().setSession(refreshResponse.data.session);

    return session?.access_token;
  } catch (e) {
    console.log(e);

    return "";
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    const session = useGlobalStore.getState().session;

    if (!session) {
      return config;
    }

    const expiresAt = session.expires_at ? new Date(session.expires_at) : null;

    if (expiresAt) {
      const fiveMinutesBeforeExpiry = subMinutes(expiresAt, 5);

      if (isBefore(new Date(), fiveMinutesBeforeExpiry)) {
        try {
          const newToken = await refreshToken();
          config.headers["Authorization"] = `Bearer ${newToken}`;
        } catch (refreshError) {
          console.error("Could not refresh token:", refreshError);
          return Promise.reject(refreshError);
        }
      } else {
        config.headers["Authorization"] = `Bearer ${session.access_token}`;
      }
    } else {
      config.headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      error.response.status === 404 &&
      error.response.data &&
      (error.response.data.isAuth === false ||
        error.response.data.isAdmin === false)
    ) {
      try {
        await refreshToken();

        return Promise.reject(error);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
