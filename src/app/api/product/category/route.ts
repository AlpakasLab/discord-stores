import { db } from '@/providers/database/client'
import { productCategories } from '@/providers/database/schema'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { authOptions } from '../../auth/[...nextauth]/route'
import { InsertProductCategorySchema } from '@/entities/productCategory'
import { eq } from 'drizzle-orm'

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

    const categories = await db
        .select({ name: productCategories.name, id: productCategories.id })
        .from(productCategories)
        .where(eq(productCategories.storeId, storeId))

    return NextResponse.json({ data: categories }, { status: 200 })
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
    const parsedBody = InsertProductCategorySchema.safeParse(data)

    if (parsedBody.success) {
        try {
            await db.insert(productCategories).values({
                id: crypto.randomUUID(),
                name: parsedBody.data.name,
                storeId: parsedBody.data.storeId
            })

            return NextResponse.json({ success: true }, { status: 201 })
        } catch (e) {
            return NextResponse.json(
                { error: 'Cannot create a new category' },
                { status: 400 }
            )
        }
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
