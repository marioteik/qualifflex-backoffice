import { z } from "zod";
import { insertSeamstressSchema, selectSeamstressSchema } from "./seamstress";
import { insertProductSchema } from "./products";
import { selectShipmentItemSchema } from "./shipment-items";
import { timestamps } from "./timestamps";
import { dateParser } from "./utils";
import { selectOrderToBuySchema } from "./order-to-buy";

export enum ShipmentStatus {
  PENDING = "Pendente",
  PENDING_APPROVAL = "Pendente aprovação",
  CONFIRMED = "Confirmado",
  IN_PRODUCTION = "Produzindo",
  COLLECTED = "Coletado",
  REFUSED = "Recusado",
}

const insertShipmentSchema = timestamps.extend({
  number: z.string().min(1, "Number is required and cannot be empty"),
  accessKey: z.optional(
    z.string().min(1, "Access key is required and cannot be empty").nullable()
  ),
  series: z.string().min(1, "Series is required and cannot be empty"),
  type: z.string().min(1, "Type is required and cannot be empty"),
  authorizationProtocol: z.optional(
    z
      .string()
      .min(1, "Authorization protocol is required and cannot be empty")
      .nullable()
  ),
  issueDate: dateParser.nullable(),
  entryExitDate: dateParser.nullable(),
  entryExitTime: z.string().nullable().optional(),
  status: z.string().optional(),
  transportationType: z.string().default("1"),
  recipient: insertSeamstressSchema,
  products: insertProductSchema.array().optional(),
});

const selectShipmentSchema = insertShipmentSchema.merge(
  z.object({
    id: z.string().uuid(),
    recipient: selectSeamstressSchema,
    items: selectShipmentItemSchema.array(),
    ordersToBuy: selectOrderToBuySchema,
    confirmedAt: dateParser.nullable().optional(),
    deliveredAt: dateParser.nullable().optional(),
    refusedAt: dateParser.nullable().optional(),
    finishedAt: dateParser.nullable().optional(),
    collectedAt: dateParser.nullable().optional(),
    totalProductValue: z.number().optional(),
    totalInvoiceValue: z.number().optional(),
    status: z
      .enum([
        "Recusado",
        "Coletado",
        "Finalizado",
        "Produzindo",
        "Produção parcial",
        "Confirmado",
        "Pendente aprovação",
        "Pendente",
      ])
      .optional(),
    size: z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
    unit: z.object({
      id: z.string().uuid(),
      unitName: z.string(),
    }),
    systemEstimation: dateParser.nullable().optional(),
    informedEstimation: dateParser.nullable().optional(),
    offsetDays: z.number().optional(),
  })
);

const updateStatusShipmentSchema = z.object({
  id: z.string().uuid(),
  status: z
    .enum([
      "Recusado",
      "Coletado",
      "Finalizado",
      "Produzindo",
      "Produção parcial",
      "Confirmado",
      "Pendente aprovação",
      "Pendente",
    ])
    .optional(),
  informedEstimation: dateParser.optional(),
  systemEstimation: dateParser.optional(),
});

const confirmShipment = z.object({
  shipmentId: z.string().uuid(),
  informedEstimation: dateParser,
});

const refuseShipment = z.object({
  shipmentId: z.string().uuid(),
});

const shipmentHistorySchema = z.object({
  id: z.number(),
  shipmentId: z.string().uuid(),
  status: z.string(),
  updatedAt: dateParser,
  shipment: z.object({
    id: z.string().uuid(),
    number: z.string(),
    informedEstimation: dateParser.nullable(),
    systemEstimation: dateParser.nullable(),
  }),
  updatedBy: z.object({
    id: z.string().uuid(),
    email: z.string().nullable(),
    profile: z.object({
      fullName: z.string(),
    }),
  }),
});

type InsertShipment = z.infer<typeof insertShipmentSchema>;
type SelectShipment = z.infer<typeof selectShipmentSchema>;
type ConfirmShipment = z.infer<typeof confirmShipment>;
type RefuseShipment = z.infer<typeof refuseShipment>;
type UpdateStatusShipment = z.infer<typeof updateStatusShipmentSchema>;
type ShipmentHistory = z.infer<typeof shipmentHistorySchema>;

export {
  insertShipmentSchema,
  selectShipmentSchema,
  updateStatusShipmentSchema,
  confirmShipment,
  refuseShipment,
  shipmentHistorySchema,
  type InsertShipment,
  type SelectShipment,
  type ConfirmShipment,
  type RefuseShipment,
  type UpdateStatusShipment,
  type ShipmentHistory,
};
