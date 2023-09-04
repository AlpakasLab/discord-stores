import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { productCategories, tags } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'

export async function getProductCategories(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    try {
        const categoriesRegistred = await db
            .select({
                name: productCategories.name,
                id: productCategories.id
            })
            .from(productCategories)
            .where(eq(productCategories.storeId, store))

        return categoriesRegistred
    } catch (error) {
        throw new Error('Cannot get categories')
    }
}

export async function getTags(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    try {
        const tagsRegistred = await db
            .select({
                name: tags.name,
                id: tags.id
            })
            .from(tags)
            .where(eq(tags.storeId, store))

        return tagsRegistred
    } catch (error) {
        throw new Error('Cannot get tags')
    }
}
