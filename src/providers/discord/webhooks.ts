import { Routes } from 'discord-api-types/v10'
import { parseWebhookURL } from '@/utils/discord'

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
            )}?wait=true`,
            {
                method: 'POST',
                body: JSON.stringify(webhookData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        if (!result.ok) return false
        const data = await result.json()
        return data
    } catch (e) {
        return false
    }
}

export const deleteMessageByWebhook = async (
    webhookUrl: string,
    messageId: string
) => {
    const parsedWebhookUrl = parseWebhookURL(webhookUrl)
    if (!parsedWebhookUrl) return false

    try {
        const result = await fetch(
            `${process.env.DISCORD_API_URL}${Routes.webhookMessage(
                parsedWebhookUrl.id,
                parsedWebhookUrl.token,
                messageId
            )}`,
            {
                method: 'DELETE'
            }
        )

        if (!result.ok) return false
        return true
    } catch (e) {
        return false
    }
}
