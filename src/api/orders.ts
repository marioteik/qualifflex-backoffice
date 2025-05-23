import { useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { fetchWithToken } from "@/lib/utils/fetch-with-token";
import type { SelectOrder } from "@/schemas/orders";

const route = "/api/orders";

export function useOrders() {
  return useQuery({
    queryKey: queryKeyFactory.orders(),
    queryFn: fetchWithToken<SelectOrder[]>(route),
    initialData: [],
  });
}
