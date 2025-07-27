import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import {
  deleteWithToken,
  fetchWithToken,
  postWithToken,
  putWithToken,
} from "@/lib/utils/fetch-with-token";
import { handleSettledMutation } from "@/lib/utils/handle-optimistic-mutation";
import type { QueryOptions } from "../../types/query-options";
import type {
  InsertShipment,
  SelectShipment,
  ShipmentHistory,
} from "@/schemas/shipments";

const route = "/api/shipments";

export function useShipments() {
  return useQuery({
    queryKey: queryKeyFactory.shipments(),
    queryFn: fetchWithToken<SelectShipment[]>(route),
    initialData: [],
  });
}

export function useShipment(id: string) {
  return useQuery({
    queryKey: queryKeyFactory.shipmentDetail(id),
    queryFn: fetchWithToken<SelectShipment>(`${route}/${id}`),
    enabled: !!id,
  });
}

export function useShipmentHistory(id: string) {
  return useQuery({
    queryKey: queryKeyFactory.shipmentHistory(id),
    queryFn: fetchWithToken<ShipmentHistory[]>(`${route}/${id}/history`),
    enabled: !!id,
  });
}

export function useRelatedShipments(recipientId?: string, enabled = false) {
  return useQuery({
    queryKey: queryKeyFactory.relatedShipments(recipientId ?? ""),
    queryFn: fetchWithToken<SelectShipment[]>(
      `${route}/${recipientId}/related`
    ),
    enabled,
  });
}

export function useCreateShipment(options: QueryOptions = {}) {
  return useMutation<InsertShipment>({
    mutationKey: queryKeyFactory.shipments(),
    mutationFn: postWithToken(route),
    ...handleSettledMutation(queryKeyFactory.shipments()),
    ...options,
  });
}

export function useUpdateShipmentStatus(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.shipments(),
    mutationFn: putWithToken(`${route}/status`),
    ...handleSettledMutation(queryKeyFactory.shipments()),
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
