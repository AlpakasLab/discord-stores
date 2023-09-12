import { getDateHourString } from '@/utils/date'
import { EmbedBuilder } from '@discordjs/builders'
import { Routes } from 'discord-api-types/v10'
import { parseWebhookURL } from '@/utils/discord'
import { SELL_TEMPLEATE_FIELDS } from '@/components/configuration/webhooks/templeates/sell'

export const sendMessageByWebhook = async (
    webhookUrl: string,
    webhookData: object
) => {
    const parsedWebhookUrl = parseWebhookURL(webhookUrl)
    if (!parsedWebhookUrl) return false

    try {
        const result = await fetch(
            `${process.env.DISCORD_API_URL}${Routes.webhook(
                parsedWebhookUrl.id,
                parsedWebhookUrl.token
            )}`,
            {
                method: 'POST',
                body: JSON.stringify(webhookData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        if (!result.ok) return false
        return true
    } catch (e) {
        return false
    }
}

type SellFields = keyof typeof SELL_TEMPLEATE_FIELDS
type OrderData = Record<SellFields, string | undefined>

export const sendOrderMessage = async (
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
    orderData: OrderData
) => {
    const embed = new EmbedBuilder()
        .setTitle(templeate.title ?? 'Registro de Venda')
        .setColor(templeate.color ?? 0x52525b)
        .setFooter({
            text: getDateHourString(new Date())
        })

    if (templeate.image) {
        embed.setThumbnail(templeate.image)
    }

    if (templeate.fields) {
        templeate.fields.values.forEach(field => {
            const fieldValue = orderData[field.value as SellFields]

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
