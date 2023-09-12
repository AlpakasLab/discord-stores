import { sendMessageByWebhook } from '@/providers/discord/webhooks'

export const sendLogsMessage = async (
    webhookUrl: string,
    title: string,
    content: string
) => {
    const dataWebhook = {
        content: `${title}\nMensagem: ${content}`
    }

    return sendMessageByWebhook(webhookUrl, dataWebhook)
}
