import { getDateHourString } from '@/utils/date'
import { EmbedBuilder } from '@discordjs/builders'
import { Routes } from 'discord-api-types/v10'
import { parseWebhookURL } from '@/utils/discord'
import { env } from '@/core/enviroment'

export const sendOrderMessage = async (
    webhookUrl: string,
    employee: string,
    customer: string,
    items: string,
    total: string,
    discount?: number,
    discountTotal?: string
) => {
    const embed = new EmbedBuilder()
        .setTitle('💰 Registro de Venda')
        .setColor(0x52525b)
        .addFields([
            {
                name: 'Vendedor',
                value: employee,
                inline: true
            },
            {
                name: 'Cliente',
                value: customer,
                inline: true
            },
            {
                name: 'Itens',
                value: items
            }
        ])
        .setFooter({
            text: getDateHourString(new Date())
        })

    if (discount && discountTotal) {
        embed.addFields([
            {
                name: '🎫 Desconto',
                value: `${discount}%`,
                inline: true
            },
            {
                name: '💸 Total',
                value: `~~${total}~~ -> ${discountTotal}`
            }
        ])
    } else {
        embed.addFields([
            {
                name: '💸 Total',
                value: total,
                inline: true
            }
        ])
    }

    const parsedWebhookUrl = parseWebhookURL(webhookUrl)

    if (!parsedWebhookUrl) return false

    try {
        const embedJson = embed.toJSON()
        const dataWebhook = {
            embeds: [embedJson]
        }

        const result = await fetch(
            `${env.DISCORD_API_URL}${Routes.webhook(
                parsedWebhookUrl.id,
                parsedWebhookUrl.token
            )}`,
            {
                method: 'POST',
                body: JSON.stringify(dataWebhook),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        if (!result.ok) {
            return false
        }

        return true
    } catch (e) {
        return false
    }
}
