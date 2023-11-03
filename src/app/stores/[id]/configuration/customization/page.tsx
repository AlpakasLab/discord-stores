import StoreColors from '@/components/configuration/colors'
import {
    CONSUMPTION_TEMPLEATE_FIELDS,
    SELL_TEMPLEATE_FIELDS,
    STOCK_TEMPLEATE_FIELDS
} from '@/components/configuration/webhooks/templeates/constants'
import WebhookTempleate from '@/components/configuration/webhooks/templeates/dialog'
import { getColors, getWebhooks } from '@/services/configuration'
import { Metadata } from 'next'
import { FaBox, FaHamburger, FaUtensils } from 'react-icons/fa'

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
        webhook => webhook.category === 'CONSUM'
    )
    const stockWebhookTempleateData = webhooks.find(
        webhook => webhook.category === 'STOCK'
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
                <div className="flex w-full flex-col gap-y-2">
                    <p className="text-sm">
                        <FaHamburger className="mr-2 inline text-base" />{' '}
                        Mensagem de Vendas
                    </p>
                    <WebhookTempleate
                        webhook={sellWebhookTempleateData?.template}
                        fields={SELL_TEMPLEATE_FIELDS}
                        title="Vendas"
                    />
                </div>
                <div className="flex w-full flex-col gap-y-2">
                    <p className="text-sm">
                        <FaUtensils className="mr-2 inline text-base" />{' '}
                        Mensagem de Consumo
                    </p>
                    <WebhookTempleate
                        webhook={consumptionWebhookTempleateData?.template}
                        fields={CONSUMPTION_TEMPLEATE_FIELDS}
                        title="Consumo"
                    />
                </div>
                <div className="flex w-full flex-col gap-y-2">
                    <p className="text-sm">
                        <FaBox className="mr-2 inline text-base" /> Mensagem de
                        Estoque
                    </p>
                    <WebhookTempleate
                        webhook={stockWebhookTempleateData?.template}
                        fields={STOCK_TEMPLEATE_FIELDS}
                        title="Estoque"
                    />
                </div>
            </div>
        </div>
    )
}
