import ShowComissions from '@/components/orders/comissions'
import OrdersFilters from '@/components/orders/filters'
import ShowOrders from '@/components/orders/show'
import { getOrders } from '@/services/order'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Vendas'
}

export default async function Orders({
    params,
    searchParams
}: {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const {
        data: orders,
        start,
        end
    } = await getOrders(
        params.id,
        searchParams.start?.toString(),
        searchParams.end?.toString(),
        searchParams.client?.toString()
    )

    return (
        <div className="container relative my-5 grid h-full w-full flex-grow grid-cols-1 place-content-start gap-5 lg:grid-cols-3">
            <div className="col-span-full h-fit rounded-md border border-zinc-700 p-4">
                <OrdersFilters />
            </div>
            <div className="h-fit rounded-md border border-zinc-700 p-4 lg:col-span-2">
                <div className="flex w-full items-center justify-between">
                    <p className="font-semibold">Vendas ({orders.length})</p>
                    <p className="text-sm text-zinc-300">
                        Período de vendas:{' '}
                        <span className="font-semibold">
                            {start} até {end}
                        </span>
                    </p>
                </div>
                <ShowOrders orders={orders} />
            </div>
            <div className="h-fit rounded-md border border-zinc-700 p-4">
                <div className="flex w-full items-center justify-between">
                    <p className="font-semibold">Comissões</p>
                </div>
                <ShowComissions orders={orders} />
            </div>
        </div>
    )
}
