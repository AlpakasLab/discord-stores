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
