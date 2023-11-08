import { z } from 'zod'

export const NotificationSchema = z.object({
    users: z.string().min(1).array(),
    title: z.string().min(3),
    description: z.string().min(3).max(255),
    icon: z.string().toLowerCase().min(3)
})

export type NotificationData = z.infer<typeof NotificationSchema>
