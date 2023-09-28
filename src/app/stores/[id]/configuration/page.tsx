import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import CategoriesConfiguration from '@/components/configuration/categories'
import StoreColors from '@/components/configuration/colors'
import DeliveryValuesConfiguration from '@/components/configuration/delivery'
import TagsConfiguration from '@/components/configuration/tags'
import WebHooksConfiguration from '@/components/configuration/webhooks'
import SellWebhookTempleate from '@/components/configuration/webhooks/templeates/sell'
import {
    getColors,
    getDeliveryValues,
    getProductCategories,
    getTags,
    getWebhooks
} from '@/services/configuration'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

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
    const session = await getServerSession(authOptions)
    const categories = await getProductCategories(params.id)
    const tags = await getTags(params.id)
    const deliveryValues = await getDeliveryValues(params.id)
    const webhooks = await getWebhooks(params.id)
    const colors = await getColors(params.id)

    const sellWebhookTempleateData = webhooks.find(
        webhook => webhook.category === 'SELL'
    )

    if (!session || (session && session.user.role !== 'ADMIN')) {
        redirect('/')
    }

    return (
        <div className="container relative mt-5 grid h-full w-full flex-grow grid-cols-1 place-content-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="flex h-full flex-col rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">
                    Categorias ({categories.length})
                </p>
                <CategoriesConfiguration
                    categories={categories}
                    store={params.id}
                />
            </div>
            <div className="flex h-full flex-col rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">Tags ({tags.length})</p>
                <TagsConfiguration tags={tags} store={params.id} />
            </div>
            <div className="h-fit rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">Discord Webhooks</p>
                <WebHooksConfiguration webhooks={webhooks} store={params.id} />
            </div>
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
            <div className="flex h-full flex-col rounded-md border border-zinc-700 p-4">
                <DeliveryValuesConfiguration
                    values={deliveryValues}
                    store={params.id}
                />
            </div>
        </div>
    )
}
