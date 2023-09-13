import { db } from '@/providers/database/client'
import { productsToTags, tags } from '@/providers/database/schema'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { authOptions } from '../auth/[...nextauth]/route'
import { InsertTagSchema } from '@/entities/tag'
import { eq } from 'drizzle-orm'

export async function DELETE(request: NextRequest) {
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

    const requestUrl = new URL(request.url)
    const tagId = requestUrl.searchParams.get('id')

    if (!tagId)
        return NextResponse.json(
            { error: 'Tag id is not provided' },
            { status: 400 }
        )

    await db.delete(tags).where(eq(tags.id, tagId))
    await db.delete(productsToTags).where(eq(productsToTags.tagId, tagId))

    return NextResponse.json({ deleted: true }, { status: 200 })
}

export async function GET(request: NextRequest) {
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

    const requestUrl = new URL(request.url)
    const storeId = requestUrl.searchParams.get('id')

    if (!storeId)
        return NextResponse.json(
            { error: 'Store id is not provided' },
            { status: 400 }
        )

    const tagsRegisters = await db
        .select({ name: tags.name, id: tags.id })
        .from(tags)
        .where(eq(tags.storeId, storeId))

    return NextResponse.json({ data: tagsRegisters }, { status: 200 })
}

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
    const parsedBody = InsertTagSchema.safeParse(data)

    if (parsedBody.success) {
        try {
            await db.insert(tags).values({
                id: crypto.randomUUID(),
                name: parsedBody.data.name,
                storeId: parsedBody.data.storeId
            })

            return NextResponse.json({ success: true }, { status: 201 })
        } catch (e) {
            return NextResponse.json(
                { error: 'Cannot create a new tag' },
                { status: 400 }
            )
        }
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
