import StoreColors from '@/components/configuration/colors'
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

    return (
        <div className="relative grid h-full w-full flex-grow grid-cols-1 place-content-stretch gap-5">
            {webhooks && sellWebhookTempleateData !== undefined && (
                <div className="h-fit rounded-md border border-zinc-700 p-4">
                    <p className="mb-2 font-semibold">Customizações</p>
                    <div className="flex flex-col items-start gap-4">
                        <div className="flex w-full items-center gap-2">
                            <p className="shrink-0 whitespace-nowrap text-sm">
                                Webhook Vendas:
                            </p>
                            <SellWebhookTempleate
                                webhook={sellWebhookTempleateData.template}
                            />
                        </div>
                        <div className="flex w-full items-center gap-2">
                            <p className="shrink-0 whitespace-nowrap text-sm">
                                Cores do Sistema:
                            </p>
                            <StoreColors store={params.id} colors={colors} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
