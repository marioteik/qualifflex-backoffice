import { fetchWithToken, postWithToken } from "@/lib/utils/fetch-with-token";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import type { PushNotificationList } from "@/schemas/push-notifications";
import { handleSettledMutation } from "@/lib/utils/handle-optimistic-mutation";
import type { QueryOptions } from "../../types/query-options";

export function useNotificationsHistory(limit = 50, offset = 0) {
  const route = `/api/push/history?limit=${limit}&offset=${offset}`;

  return useQuery({
    queryKey: queryKeyFactory.pushNotificationHistory(limit, offset),
    queryFn: fetchWithToken<PushNotificationList>(route),
    initialData: { notifications: [], total: 0, limit, offset },
  });
}

export function useSendBroadcastNotification(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.pushNotifications(),
    mutationFn: postWithToken("/api/push/broadcast"),
    ...handleSettledMutation(queryKeyFactory.pushNotifications()),
    ...options,
  });
}
