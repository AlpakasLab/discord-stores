import { Metadata } from 'next'
import React from 'react'
import { StockContextProvider } from '@/components/stock/context'
import { getItems } from '@/services/stock'
import ItemsShow from '@/components/stock/show'
import StockResume from '@/components/stock/resume'

export const metadata: Metadata = {
    title: 'Estoque'
}

export default async function StoreDetail({
    params
}: {
    params: { id: string }
}) {
    const items = await getItems(params.id)

    return (
        <div className="container relative flex h-full w-full flex-grow flex-row items-stretch justify-stretch">
            <StockContextProvider>
                <div className="h-full w-full flex-grow pb-10 pr-2 pt-5 lg:pr-5">
                    <ItemsShow items={items} storeId={params.id} />
                </div>
                <StockResume storeId={params.id} />
            </StockContextProvider>
        </div>
    )
}
