import StoreColors from '@/components/configuration/colors'
import ConsumptionWebhookTempleate from '@/components/configuration/webhooks/templeates/consumption'
import SellWebhookTempleate from '@/components/configuration/webhooks/templeates/sell'
import { getColors, getWebhooks } from '@/services/configuration'
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
    const colors = await getColors(params.id)

    const sellWebhookTempleateData = webhooks.find(
        webhook => webhook.category === 'SELL'
    )
    const consumptionWebhookTempleateData = webhooks.find(
        webhook => webhook.category === 'SELL'
    )

    return (
        <div className="relative flex h-full w-full flex-grow flex-col gap-5">
            <div className="flex w-full flex-col items-start gap-5 border-b border-zinc-800 pb-4">
                <p className="shrink-0 whitespace-nowrap text-lg font-semibold">
                    Cores do Sistema
                </p>
                <StoreColors store={params.id} colors={colors} />
            </div>
            <div className="grid w-full grid-cols-3 gap-5">
                <p className="col-span-full shrink-0 whitespace-nowrap text-lg font-semibold">
                    Webhook Templeates
                </p>
                {webhooks && sellWebhookTempleateData !== undefined && (
                    <SellWebhookTempleate
                        webhook={sellWebhookTempleateData.template}
                    />
                )}
                {webhooks && consumptionWebhookTempleateData !== undefined && (
                    <ConsumptionWebhookTempleate
                        webhook={consumptionWebhookTempleateData.template}
                    />
                )}
            </div>
        </div>
    )
}
