import ProductsShow from '@/components/products/show'
import { SellContextProvider } from '@/components/orders/context'
import OrderResume from '@/components/orders/resume'
import { getDeliveryValues, verifyOrderEnabled } from '@/services/configuration'
import { getProducts } from '@/services/product'
import { getTagsColors } from '@/services/tags'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Produtos'
}

export default async function StoreDetail({
    params
}: {
    params: { id: string }
}) {
    const products = await getProducts(params.id)
    const deliveryValues = await getDeliveryValues(params.id)
    const tagsColors = await getTagsColors(params.id)
    const enableOrder = await verifyOrderEnabled(params.id)

    return (
        <div className="container relative flex h-full w-full flex-grow flex-row items-stretch justify-stretch">
            <SellContextProvider>
                <div className="h-full w-full flex-grow pb-10 pr-2 pt-5 lg:pr-5">
                    <ProductsShow
                        products={products}
                        tagsColors={tagsColors}
                        storeId={params.id}
                    />
                </div>
                <OrderResume
                    deliveryValues={deliveryValues}
                    enableOrder={enableOrder}
                    storeId={params.id}
                />
            </SellContextProvider>
        </div>
    )
}
