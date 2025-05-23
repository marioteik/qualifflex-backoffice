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
import type { InsertShipment, SelectShipment } from "@/schemas/shipments";

const route = "/api/shipments";

export function useShipments() {
  return useQuery({
    queryKey: queryKeyFactory.shipments(),
    queryFn: fetchWithToken<SelectShipment[]>(route),
    initialData: [],
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

export function useUpdateShipment(options: QueryOptions = {}) {
  return useMutation({
    mutationKey: queryKeyFactory.shipments(),
    mutationFn: putWithToken(route),
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
