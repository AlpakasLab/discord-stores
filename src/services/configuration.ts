import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import {
    discordWebhooks,
    productCategories,
    tags,
    webhooksTemplates
} from '@/providers/database/schema'
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

export async function getWebhooks(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    try {
        const hooksRegistred = await db
            .select({
                id: discordWebhooks.id,
                url: discordWebhooks.url,
                category: discordWebhooks.category,
                template: webhooksTemplates
            })
            .from(discordWebhooks)
            .where(eq(discordWebhooks.storeId, store))
            .innerJoin(
                webhooksTemplates,
                eq(webhooksTemplates.id, discordWebhooks.webhooksTemplateId)
            )

        return hooksRegistred
    } catch (error) {
        throw new Error('Cannot get webhooks')
    }
}

export async function verifyOrderEnabled(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    try {
        const hooksRegistred = await db
            .select({
                id: discordWebhooks.id,
                url: discordWebhooks.url,
                category: discordWebhooks.category
            })
            .from(discordWebhooks)
            .where(eq(discordWebhooks.storeId, store))

        return (
            hooksRegistred.length > 0 &&
            hooksRegistred.find(hook => hook.category === 'SELL') !== undefined
        )
    } catch (error) {
        throw new Error('Cannot get webhooks')
    }
}
