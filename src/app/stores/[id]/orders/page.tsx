import ShowOrders from '@/components/sell/show'
import { getOrders } from '@/services/order'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Vendas'
}

export default async function Orders({ params }: { params: { id: string } }) {
    const orders = await getOrders(params.id)

    return (
        <div className="container relative mt-5 h-full w-full flex-grow">
            <div className="h-fit rounded-md border border-zinc-700 p-4">
                <div className="flex w-full items-center justify-between">
                    <p className="font-semibold">Vendas</p>
                </div>
                <ShowOrders orders={orders} />
            </div>
        </div>
    )
}
