import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { InsertProductSchema } from '@/entities/product'
import { db } from '@/providers/database/client'
import { products, productsToTags, tags } from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'

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
    const productId = requestUrl.searchParams.get('id')

    if (!productId)
        return NextResponse.json(
            { error: 'Store id is not provided' },
            { status: 400 }
        )

    const productRegisters = await db
        .select({ id: products.id, category: products.categoryId })
        .from(products)
        .where(eq(products.id, productId))

    const product = productRegisters.at(0)

    if (!product)
        return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
        )

    const tagsRegisters = await db
        .select({ id: tags.id })
        .from(productsToTags)
        .where(eq(productsToTags.productId, productId))
        .innerJoin(tags, eq(productsToTags.tagId, tags.id))

    return NextResponse.json(
        { data: product, tags: tagsRegisters },
        { status: 200 }
    )
}

export async function PUT(request: NextRequest) {
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
    const parsedBody = InsertProductSchema.safeParse(data)

    if (parsedBody.success && parsedBody.data.id) {
        const productId = parsedBody.data.id

        await db
            .update(products)
            .set({
                name: parsedBody.data.name,
                description: parsedBody.data.description,
                categoryId: parsedBody.data.category,
                image: parsedBody.data.image,
                price: parsedBody.data.price
            })
            .where(eq(products.id, productId))

        if (parsedBody.data.tags !== undefined) {
            await db
                .delete(productsToTags)
                .where(eq(productsToTags.productId, productId))

            if (parsedBody.data.tags.length > 0) {
                await db.insert(productsToTags).values(
                    parsedBody.data.tags.map(item => ({
                        productId: productId,
                        tagId: item
                    }))
                )
            }

            return NextResponse.json({ success: true }, { status: 200 })
        } else {
            return NextResponse.json({ success: true }, { status: 200 })
        }
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
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
    const parsedBody = InsertProductSchema.safeParse(data)

    if (parsedBody.success) {
        const newProductId = crypto.randomUUID()

        await db.insert(products).values({
            id: newProductId,
            name: parsedBody.data.name,
            price: parsedBody.data.price,
            description: parsedBody.data.description,
            image: parsedBody.data.image,
            storeId: parsedBody.data.store,
            categoryId: parsedBody.data.category
        })

        if (parsedBody.data.tags) {
            await db.insert(productsToTags).values(
                parsedBody.data.tags.map(item => ({
                    productId: newProductId,
                    tagId: item
                }))
            )
            return NextResponse.json({ success: true }, { status: 201 })
        } else {
            return NextResponse.json({ success: true }, { status: 201 })
        }
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
