// /schemas/zodSchemas/orderSchema.ts
import { z } from "zod";
import { timestamps } from "./timestamps";
import { selectShipmentSchema } from "./shipments";
import { selectProductSchema } from "./products";

const insertOrderSchema = z
  .object({
    codeReference: z
      .string()
      .min(1, "Code reference is required and cannot be empty"),
  })
  .merge(timestamps);

const selectOrderSchema = z
  .object({
    id: z.string().uuid(),
    shipments: z
      .object({
        orderId: z.string().uuid(),
        shipment: selectShipmentSchema,
        shipmentId: z.string().uuid(),
      })
      .merge(timestamps)
      .array(),
    shipmentItems: z
      .object({
        orderId: z.string().uuid(),
        shipmentItem: selectProductSchema,
        shipmentId: z.string().uuid(),
      })
      .merge(timestamps)
      .array(),
  })
  .merge(insertOrderSchema);

const listOrdersSchema = z.object({
  id: z.string().uuid(),
  codeReference: z.string(),
  createdAt: z.date(),
  shipments: z.array(
    z.object({
      shipmentId: z.string().uuid(),
      shipment: z.object({
        number: z.string(),
      }),
    })
  ),
  shipmentItems: z.array(
    z.object({
      shipmentItemId: z.string().uuid(),
      shipmentItem: z.object({
        id: z.string().uuid(),
        quantity: z.string(), // numeric fields come as strings from DB
        product: z.object({
          id: z.string().uuid(),
          description: z.string(),
        }),
      }),
    })
  ),
});

type InsertOrder = z.infer<typeof insertOrderSchema>;
type SelectOrder = z.infer<typeof selectOrderSchema>;
type ListOrders = z.infer<typeof listOrdersSchema>;

export {
  insertOrderSchema,
  selectOrderSchema,
  listOrdersSchema,
  type InsertOrder,
  type SelectOrder,
  type ListOrders,
};
