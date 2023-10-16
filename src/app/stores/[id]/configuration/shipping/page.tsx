import DeliveryValuesConfiguration from '@/components/configuration/delivery'
import { getDeliveryValues } from '@/services/configuration'
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
    const deliveryValues = await getDeliveryValues(params.id)

    return (
        <div className="relative flex h-full w-full flex-grow flex-col">
            <div className="flex h-full flex-col rounded-md border border-zinc-700 p-4">
                <DeliveryValuesConfiguration
                    values={deliveryValues}
                    store={params.id}
                />
            </div>
        </div>
    )
}
