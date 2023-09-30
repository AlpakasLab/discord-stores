import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { db } from '@/providers/database/client'
import { notifications } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const requestUrl = new URL(request.url)
    const notificationId = requestUrl.searchParams.get('id')

    if (!notificationId)
        return NextResponse.json(
            { error: 'Notification id is not provided' },
            { status: 400 }
        )

    await db.delete(notifications).where(eq(notifications.id, notificationId))

    return NextResponse.json({ deleted: true }, { status: 200 })
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const notificationsRegisters = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, session.user.id))

    return NextResponse.json(
        { notifications: notificationsRegisters },
        { status: 200 }
    )
}
