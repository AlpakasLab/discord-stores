import ConsumptionConfiguration from '@/components/configuration/consumption'
import WebHooksConfiguration from '@/components/configuration/webhooks'
import ConsumptionWebhookTempleate from '@/components/configuration/webhooks/templeates/consumption'
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

    const consumptionWebhook = webhooks.find(hook => hook.category === 'CONSUM')

    return (
        <div className="relative grid h-full w-full flex-grow grid-cols-1 place-content-stretch gap-5 md:grid-cols-2">
            <div className="h-fit rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">Discord Webhooks</p>
                <WebHooksConfiguration webhooks={webhooks} store={params.id} />
            </div>
            <div className="flex h-fit flex-col rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">Consumo</p>
                <ConsumptionConfiguration
                    webhook={consumptionWebhook}
                    store={params.id}
                />
                {consumptionWebhook && (
                    <div className="mt-4 w-full">
                        <ConsumptionWebhookTempleate
                            webhook={consumptionWebhook.template}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
