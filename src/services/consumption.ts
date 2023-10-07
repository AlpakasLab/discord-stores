import { EmbedBuilder } from '@discordjs/builders'
import { sendMessageByWebhook } from '@/providers/discord/webhooks'
import { CONSUMPTION_TEMPLEATE_FIELDS } from '@/components/configuration/webhooks/templeates/consumption'

type SellFields = keyof typeof CONSUMPTION_TEMPLEATE_FIELDS
type OrderData = Record<SellFields, string | undefined>

export const sendConsumptionMessage = async (
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
        .setTitle(
            templeate.title && templeate.title.length > 0
                ? templeate.title
                : 'Registro de Consumo'
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
