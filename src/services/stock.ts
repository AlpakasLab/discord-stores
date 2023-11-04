import { STOCK_TEMPLEATE_FIELDS } from '@/components/configuration/webhooks/templeates/constants'
import { db } from '@/providers/database/client'
import { items, productCategories } from '@/providers/database/schema'
import { sendMessageByWebhook } from '@/providers/discord/webhooks'
import { EmbedBuilder } from '@discordjs/builders'
import { asc, eq } from 'drizzle-orm'

type StockFields = keyof typeof STOCK_TEMPLEATE_FIELDS
type StockData = Record<StockFields, string | undefined>

export const sendStockMessage = async (
    webhookUrl: string,
    templeate: {
        id: string
        title: string | null
        color: number | null
        image: string | null
        fields: {
            values: {
                title: string
                value: string
                inline?: boolean | undefined
            }[]
        } | null
    },
    stockData: StockData
) => {
    const embed = new EmbedBuilder()
        .setTitle(
            templeate.title && templeate.title.length > 0
                ? templeate.title
                : 'Registro de Estoque'
        )
        .setColor(
            templeate.color && !isNaN(templeate.color)
                ? templeate.color
                : 0x52525b
        )

    if (templeate.image) {
        embed.setThumbnail(templeate.image)
    }

    if (templeate.fields) {
        templeate.fields.values.forEach(field => {
            const fieldValue = stockData[field.value as StockFields]

            if (fieldValue) {
                embed.addFields({
                    name: field.title,
                    value: fieldValue,
                    inline: field.inline
                })
            }
        })
    }

    const embedJson = embed.toJSON()
    const dataWebhook = {
        embeds: [embedJson]
    }

    return sendMessageByWebhook(webhookUrl, dataWebhook)
}

export async function getItems(store: string) {
    try {
        const itemsRegistred = await db
            .select({
                id: items.id,
                name: items.name,
                image: items.image,
                category: productCategories.name,
                categoryOrder: productCategories.order,
                store: items.storeId
            })
            .from(items)
            .where(eq(items.storeId, store))
            .orderBy(asc(items.name))
            .innerJoin(
                productCategories,
                eq(productCategories.id, items.categoryId)
            )

        itemsRegistred.sort((a, b) => {
            if (a.categoryOrder > b.categoryOrder) {
                return 1
            }

            if (b.categoryOrder > a.categoryOrder) {
                return -1
            }

            return 0
        })

        return itemsRegistred
    } catch (error) {
        throw new Error('Cannot get items')
    }
}
