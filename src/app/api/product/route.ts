import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { InsertProductSchema } from '@/entities/product'
import { db } from '@/providers/database/client'
import { products, productsToTags } from '@/providers/database/schema'

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
