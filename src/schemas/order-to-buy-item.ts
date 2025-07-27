import z from "zod";
import { selectProductSchema } from "./products";
import { timestamps } from "./timestamps";

export const insertOrderToBuyItemSchema = timestamps.extend({
  shipmentId: z.string().uuid(),
  orderToBuyId: z.string().uuid(),
  productId: z.string().uuid(),
  unitId: z.string().uuid(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
});

export const selectOrderToBuyItemSchema = insertOrderToBuyItemSchema.extend({
  id: z.string().uuid(),
  product: selectProductSchema,
});
