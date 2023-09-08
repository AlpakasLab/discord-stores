export function parseWebhookURL(url: string) {
    const matches = url.match(
        /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i
    )

    if (!matches || matches.length <= 2) return null

    const [, id, token] = matches
    return {
        id,
        token
    }
}
