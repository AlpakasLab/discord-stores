import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import NewProduct from '@/components/products/new'
import ProductsShow from '@/components/products/show'
import { SellContextProvider } from '@/components/sell/context'
import OrderResume from '@/components/sell/resume'
import { verifyOrderEnabled } from '@/services/configuration'
import { getProducts } from '@/services/product'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function StoreDetail({
    params
}: {
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)
    const products = await getProducts(params.id)
    const enableOrder = await verifyOrderEnabled(params.id)

    return (
        <div className="container relative flex h-full w-full flex-grow flex-row items-stretch justify-stretch">
            <SellContextProvider>
                <div className="h-full w-full flex-grow pb-10 pr-2 pt-5 lg:pr-5">
                    <header className="z-10 flex w-full items-center justify-between bg-zinc-900 pb-5">
                        <p className="text-lg font-bold sm:text-xl">
                            Produtos ({products.length})
                        </p>
                        <div className="flex items-center gap-x-5">
                            {session && session.user.role === 'ADMIN' && (
                                <div className="max-w-[10rem]">
                                    <NewProduct />
                                </div>
                            )}
                        </div>
                    </header>
                    <ProductsShow
                        products={products}
                        isAdmin={session?.user.role === 'ADMIN'}
                    />
                </div>
                <OrderResume enableOrder={enableOrder} storeId={params.id} />
            </SellContextProvider>
        </div>
    )
}
