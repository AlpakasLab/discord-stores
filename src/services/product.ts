import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import {
    productCategories,
    products,
    productsToTags,
    tags
} from '@/providers/database/schema'
import { asc, eq, sql } from 'drizzle-orm'
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
                promotionalPrice: products.promotionalPrice,
                image: products.image,
                active: products.active,
                category: productCategories.name,
                categoryOrder: productCategories.order,
                tags: sql<string>`group_concat(${tags.name})`,
                store: products.storeId
            })
            .from(products)
            .where(eq(products.storeId, store))
            .orderBy(asc(products.name))
            .innerJoin(
                productCategories,
                eq(productCategories.id, products.categoryId)
            )
            .leftJoin(productsToTags, eq(products.id, productsToTags.productId))
            .leftJoin(tags, eq(productsToTags.tagId, tags.id))
            .groupBy(sql`${products.id}`)

        productsRegistred.sort((a, b) => {
            if (a.categoryOrder > b.categoryOrder) {
                return 1
            }

            if (b.categoryOrder > a.categoryOrder) {
                return -1
            }

            return 0
        })

        return productsRegistred
    } catch (error) {
        throw new Error('Cannot get products')
    }
}
