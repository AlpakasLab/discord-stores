import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { db } from '@/providers/database/client'
import { accounts, notifications } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.email
    )
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
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.email ||
        !session.user.role
    )
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const userRegisters = await db
        .select({ id: accounts.userId })
        .from(accounts)
        .where(eq(accounts.access_token, session.user.discord))
    const user = userRegisters.at(0)

    if (!user) {
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )
    }

    const notificationsRegisters = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, user.id))

    return NextResponse.json(
        { notifications: notificationsRegisters },
        { status: 200 }
    )
}
