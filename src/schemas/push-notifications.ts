import { z } from "zod";

const pushNotificationSchema = z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    data: z.any().optional(),
    recipientType: z.string(),
    recipientIds: z.array(z.string()).nullable(),
    sentAt: z.string(),
    successCount: z.string(),
    failureCount: z.string(),
    status: z.string(),
    sender: z.object({
        id: z.string().nullable(),
        name: z.string().nullable(),
        email: z.string().nullable(),
    }).nullable(),
});

const pushNotificationListSchema = z.object({
    notifications: z.array(pushNotificationSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
});

type PushNotification = z.infer<typeof pushNotificationSchema>;
type PushNotificationList = z.infer<typeof pushNotificationListSchema>;

export type {
    PushNotification,
    PushNotificationList
}

export {
    pushNotificationSchema,
    pushNotificationListSchema
}