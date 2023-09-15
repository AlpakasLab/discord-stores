import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import {
    discordWebhooks,
    productCategories,
    stores,
    tags,
    webhooksTemplates
} from '@/providers/database/schema'
import { asc, eq } from 'drizzle-orm'
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
                id: productCategories.id,
                order: productCategories.order
            })
            .from(productCategories)
            .where(eq(productCategories.storeId, store))
            .orderBy(asc(productCategories.order))

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
                id: tags.id,
                color: tags.color
            })
            .from(tags)
            .where(eq(tags.storeId, store))
            .orderBy(asc(tags.name))

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

export async function getColors(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    try {
        const colorsRegistred = await db
            .select({
                primaryColor: stores.primaryColor,
                secondaryColor: stores.secondaryColor
            })
            .from(stores)
            .where(eq(stores.id, store))

        return colorsRegistred.at(0)
    } catch (error) {
        throw new Error('Cannot get colors')
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
