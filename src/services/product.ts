import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import {
    productCategories,
    products,
    productsToTags,
    tags
} from '@/providers/database/schema'
import { eq, sql } from 'drizzle-orm'
import { getServerSession } from 'next-auth'

export async function getProducts(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    try {
        const productsRegistred = await db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                price: products.price,
                image: products.image,
                active: products.active,
                category: productCategories.name,
                tags: sql<string>`group_concat(${tags.name})`,
                store: products.storeId
            })
            .from(products)
            .where(eq(products.storeId, store))
            .orderBy(products.name)
            .innerJoin(
                productCategories,
                eq(productCategories.id, products.categoryId)
            )
            .leftJoin(productsToTags, eq(products.id, productsToTags.productId))
            .leftJoin(tags, eq(productsToTags.tagId, tags.id))
            .groupBy(sql`${products.id}`)

        productsRegistred.sort((a, b) => {
            if (a.category > b.category) {
                return 1
            }

            if (b.category > a.category) {
                return -1
            }

            return 0
        })

        return productsRegistred
    } catch (error) {
        console.log(error)
        throw new Error('Cannot get products')
    }
}
