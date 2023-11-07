import { StoreColorsSchema, StoreSchema } from '@/entities/store'
import { db } from '@/providers/database/client'
import { employeeRoles, employees, stores } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { authOptions } from '../auth/[...nextauth]/route'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === 'SELLER')
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = StoreColorsSchema.safeParse(data)

    if (parsedBody.success && parsedBody.data.id) {
        await db
            .update(stores)
            .set({
                primaryColor: parsedBody.data.primaryColor,
                secondaryColor: parsedBody.data.secondaryColor
            })
            .where(eq(stores.id, parsedBody.data.id))

        return NextResponse.json({ success: true }, { status: 200 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === 'SELLER' || !session.user.id)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = StoreSchema.safeParse(data)

    if (parsedBody.success) {
        const storeId = crypto.randomUUID()

        await db.insert(stores).values({
            id: storeId,
            name: parsedBody.data.name,
            serverId: parsedBody.data.server,
            ownerId: session.user.id
        })

        const roleId = crypto.randomUUID()

        await db.insert(employeeRoles).values({
            id: roleId,
            name: 'Proprietário',
            comission: parsedBody.data.comission,
            storeId: storeId,
            manager: true
        })

        await db.insert(employees).values({
            id: crypto.randomUUID(),
            name: parsedBody.data.ownerName,
            storeId: storeId,
            status: 'ACTIVE',
            userId: session.user.id,
            employeeRoleId: roleId
        })

        return NextResponse.json({ id: storeId }, { status: 201 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
