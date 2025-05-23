import { useQuery } from "@tanstack/react-query";
import { queryKeyFactory } from "@/lib/utils/query-key";
import { fetchWithToken } from "@/lib/utils/fetch-with-token";
import { SelectShipmentImport } from "@/schemas/shipments-imports";

const route = "/api/shipment-imports";

export function useShipmentsImports() {
  return useQuery({
    queryKey: queryKeyFactory.shipmentsImports(),
    queryFn: fetchWithToken<SelectShipmentImport[]>(route),
    initialData: [],
  });
}
