import { db } from '@/providers/database/client'
import {
    deliveryValues,
    discordWebhooks,
    productCategories,
    stores,
    tags,
    webhooksTemplates
} from '@/providers/database/schema'
import { asc, eq } from 'drizzle-orm'

export async function getProductCategories(store: string) {
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

export async function getDeliveryValues(store: string) {
    try {
        const deliveryValuesRegistred = await db
            .select({
                id: deliveryValues.id,
                description: deliveryValues.description,
                value: deliveryValues.value
            })
            .from(deliveryValues)
            .where(eq(deliveryValues.storeId, store))
            .orderBy(asc(deliveryValues.value))

        return deliveryValuesRegistred
    } catch (error) {
        throw new Error('Cannot get delivery values')
    }
}

export async function getWebhooks(store: string) {
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

export async function verifyConsumptionEnabled(store: string) {
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
            hooksRegistred.find(hook => hook.category === 'CONSUM') !==
                undefined
        )
    } catch (error) {
        throw new Error('Cannot get webhooks')
    }
}
