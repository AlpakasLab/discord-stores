import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import TextInput from '@/components/inputs/text'
import ProductCard from '@/components/products/card'
import NewProduct from '@/components/products/new'
import ProductsShow from '@/components/products/show'
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

    return (
        <div className="container relative flex h-full w-full flex-grow flex-row items-stretch justify-stretch divide-x divide-zinc-700">
            <div className="h-full w-full flex-grow pr-5">
                <header className="z-10 flex w-full items-center justify-between bg-zinc-900 pb-5 pt-5">
                    <p className="text-xl font-bold">
                        Produtos ({products.length})
                    </p>
                    <div className="flex items-center gap-x-5">
                        <TextInput
                            type="text"
                            placeholder="Pesquisar Produto"
                        />
                        <div className="max-w-[10rem]">
                            {session && session.user.role === 'ADMIN' && (
                                <NewProduct />
                            )}
                        </div>
                    </div>
                </header>
                <ProductsShow products={products} />
            </div>
            <aside className="h-full w-96 flex-shrink-0 pl-5"></aside>
        </div>
    )
}
