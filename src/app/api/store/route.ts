import { InsertStoreSchema } from '@/entities/store'
import { db } from '@/providers/database/client'
import { accounts, stores } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.email ||
        !session.user.role ||
        session.user.role !== 'ADMIN'
    )
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = InsertStoreSchema.safeParse(data)

    if (parsedBody.success) {
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

        await db.insert(stores).values({
            id: crypto.randomUUID(),
            name: parsedBody.data.name,
            serverId: parsedBody.data.server,
            ownerId: user.id
        })

        const storesRegisters = await db
            .select({ id: stores.id })
            .from(stores)
            .where(eq(stores.serverId, parsedBody.data.server))
            .limit(1)

        const store = storesRegisters.at(0)

        if (store) {
            return NextResponse.json({ id: store.id }, { status: 201 })
        } else {
            return NextResponse.json(
                { error: 'Cannot create a new store' },
                { status: 400 }
            )
        }
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
