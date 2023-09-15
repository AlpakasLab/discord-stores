import { db } from '@/providers/database/client'
import { productCategories, products } from '@/providers/database/schema'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { authOptions } from '../../auth/[...nextauth]/route'
import { ProductCategorySchema } from '@/entities/productCategory'
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
    const categoryId = requestUrl.searchParams.get('id')

    if (!categoryId)
        return NextResponse.json(
            { error: 'Category id is not provided' },
            { status: 400 }
        )

    const categories = await db
        .select({ id: productCategories.id, products: products })
        .from(productCategories)
        .where(eq(productCategories.id, categoryId))
        .leftJoin(products, eq(products.categoryId, productCategories.id))

    if (!categories || categories.length <= 0) {
        return NextResponse.json(
            { error: 'Category not found' },
            { status: 404 }
        )
    }

    const category = categories.at(0)

    if (category && category.products !== null)
        return NextResponse.json(
            { error: 'Category is used by some products' },
            { status: 403 }
        )

    await db
        .delete(productCategories)
        .where(eq(productCategories.id, categoryId))

    return NextResponse.json({ deleted: true }, { status: 200 })
}

export async function GET(request: NextRequest) {
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
    const parsedBody = ProductCategorySchema.safeParse(data)

    if (parsedBody.success) {
        try {
            await db.insert(productCategories).values({
                id: crypto.randomUUID(),
                name: parsedBody.data.name,
                order: parsedBody.data.order,
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
