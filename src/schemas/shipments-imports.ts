import { z } from "zod";

import { timestamps } from "./timestamps";

export const selectShipmentImportSchema = timestamps.extend({
  id: z.string(),
  shipments: z.array(z.string()),
});

export type SelectShipmentImport = z.infer<typeof selectShipmentImportSchema>;
