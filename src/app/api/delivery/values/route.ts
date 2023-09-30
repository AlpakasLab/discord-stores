import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { deliveryValues } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'
import { DeliveryValueSchema } from '@/entities/deliveryValue'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = DeliveryValueSchema.safeParse(data)

    if (parsedBody.success) {
        await db.insert(deliveryValues).values({
            id: crypto.randomUUID(),
            description: parsedBody.data.description,
            value: parsedBody.data.value,
            storeId: parsedBody.data.store
        })

        return NextResponse.json({ success: true }, { status: 201 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = DeliveryValueSchema.safeParse(data)

    if (parsedBody.success && parsedBody.data.id) {
        await db
            .update(deliveryValues)
            .set({
                description: parsedBody.data.description,
                value: parsedBody.data.value
            })
            .where(eq(deliveryValues.id, parsedBody.data.id))

        return NextResponse.json({ success: true }, { status: 200 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
