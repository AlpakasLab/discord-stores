import { InsertStoreSchema } from '@/entities/store'
import { db } from '@/providers/database/client'
import { stores } from '@/providers/database/schema'
import { getUserAccount } from '@/services/user'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

export async function POST(request: NextRequest) {
    const { discordToken, role } = await getUserAccount()
    if (!discordToken || role !== 'ADMIN')
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = InsertStoreSchema.safeParse(data)

    if (parsedBody.success) {
        await db.insert(stores).values({
            id: crypto.randomUUID(),
            name: parsedBody.data.name,
            serverId: parsedBody.data.server
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
