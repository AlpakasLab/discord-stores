import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/core/auth'
import { db } from '@/providers/database/client'
import { items } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'
import { ItemSchema } from '@/entities/item'

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const requestUrl = new URL(request.url)
    const itemId = requestUrl.searchParams.get('id')

    if (!itemId)
        return NextResponse.json(
            { error: 'Item id is not provided' },
            { status: 400 }
        )

    await db.delete(items).where(eq(items.id, itemId))

    return NextResponse.json({ deleted: true }, { status: 200 })
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const requestUrl = new URL(request.url)
    const itemId = requestUrl.searchParams.get('id')

    if (!itemId)
        return NextResponse.json(
            { error: 'Item id is not provided' },
            { status: 400 }
        )

    const itemRegisters = await db
        .select({ id: items.id, category: items.categoryId })
        .from(items)
        .where(eq(items.id, itemId))

    const item = itemRegisters.at(0)

    if (!item)
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })

    return NextResponse.json({ data: item }, { status: 200 })
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = ItemSchema.safeParse(data)

    if (parsedBody.success && parsedBody.data.id) {
        await db
            .update(items)
            .set({
                name: parsedBody.data.name,
                categoryId: parsedBody.data.category,
                image: parsedBody.data.image
            })
            .where(eq(items.id, parsedBody.data.id))

        return NextResponse.json({ success: true }, { status: 200 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = ItemSchema.safeParse(data)

    if (parsedBody.success) {
        await db.insert(items).values({
            id: crypto.randomUUID(),
            name: parsedBody.data.name,
            image: parsedBody.data.image,
            storeId: parsedBody.data.store,
            categoryId: parsedBody.data.category
        })

        return NextResponse.json({ success: true }, { status: 201 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
