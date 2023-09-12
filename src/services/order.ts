import { getDateHourString } from '@/utils/date'
import { EmbedBuilder } from '@discordjs/builders'
import { SELL_TEMPLEATE_FIELDS } from '@/components/configuration/webhooks/templeates/sell'
import { sendMessageByWebhook } from '@/providers/discord/webhooks'

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
