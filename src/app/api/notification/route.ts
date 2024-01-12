import { getServerSession } from 'next-auth'
import { authOptions } from '@/core/auth'
import { NotificationSchema } from '@/entities/notification'
import { db } from '@/providers/database/client'
import { notifications } from '@/providers/database/schema'

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'MASTER')
        return Response.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = NotificationSchema.safeParse(data)

    if (parsedBody.success) {
        await db.insert(notifications).values(
            parsedBody.data.users.map(user => ({
                id: crypto.randomUUID(),
                author: 'Sistema',
                description: parsedBody.data.description,
                title: parsedBody.data.title,
                icon: parsedBody.data.icon,
                userId: user
            }))
        )

        return Response.json({ success: true }, { status: 201 })
    } else {
        return Response.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
