import { z } from "zod";
import {
  insertOrderToBuyItemSchema,
  selectOrderToBuyItemSchema,
} from "./order-to-buy-item";
import { timestamps } from "./timestamps";

export const insertOrderToBuySchema = timestamps.extend({
  codeReference: z.string(),
  itemsQuantity: z.number(),
  productsQuantity: z.number(),
  totalValue: z.number(),
  shipmentId: z.string().uuid(),
  items: insertOrderToBuyItemSchema.array(),
});

export const selectOrderToBuySchema = insertOrderToBuySchema.merge(
  z.object({
    id: z.string().uuid(),
    items: selectOrderToBuyItemSchema.array(),
  })
);

export type InsertOrderToBuy = z.infer<typeof insertOrderToBuySchema>;
export type SelectOrderToBuy = z.infer<typeof selectOrderToBuySchema>;
