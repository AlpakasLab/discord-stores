import WebHooksForm from '@/components/configuration/webhooks'
import { getWebhooks } from '@/services/configuration'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Configurações'
}

export default async function Configuration({
    params
}: {
    params: { id: string }
}) {
    const webhooks = await getWebhooks(params.id)

    return (
        <div className="relative flex h-full w-full flex-grow flex-col items-start gap-5">
            <p className="w-full shrink-0 whitespace-nowrap text-lg font-semibold">
                Discord Webhooks
            </p>
            <WebHooksForm webhooks={webhooks} store={params.id} />
        </div>
    )
}
