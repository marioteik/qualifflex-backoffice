import { useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { fetchWithToken } from "@/lib/utils/fetch-with-token";
import type { SelectOrderToBuy } from "@/schemas/order-to-buy";

const route = "/api/orders-to-buy";

export function useOrdersToBuy() {
  return useQuery({
    queryKey: queryKeyFactory.ordersToBuy(),
    queryFn: fetchWithToken<SelectOrderToBuy[]>(route),
    initialData: [],
  });
}

export function useOrderToBuy(id: string) {
  return useQuery({
    queryKey: queryKeyFactory.orderToBuy(id),
    queryFn: fetchWithToken<SelectOrderToBuy>(`${route}/${id}`),
    enabled: !!id,
  });
}
