import { SellContextProvider } from '@/components/orders/context'
import { getProducts } from '@/services/product'
import { Metadata } from 'next'
import React from 'react'
import ConsumptionProducts from '@/components/consumption/products'
import OrderResume from '@/components/consumption/resume'

export const metadata: Metadata = {
    title: 'Consumo'
}

export default async function Consumption({
    params
}: {
    params: { id: string }
}) {
    const products = await getProducts(params.id)

    return (
        <div className="container relative flex h-full w-full flex-grow flex-row items-stretch justify-stretch">
            <SellContextProvider>
                <div className="h-full w-full flex-grow pb-10 pr-2 pt-5 lg:pr-5">
                    <ConsumptionProducts products={products} />
                </div>
                <OrderResume storeId={params.id} />
            </SellContextProvider>
        </div>
    )
}
