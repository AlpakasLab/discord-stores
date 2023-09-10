'use client'

import React, { useRef } from 'react'
import ProductCard from './card'
import ProductDetailDialog, { ProductDetailDialogHandles } from './detail'
import CreateProductDialog, { CreateProductDialogHandles } from './create'

type ProductsShowProps = {
    products: {
        id: string
        name: string
        description: string | null
        price: number
        image: string | null
        active: boolean
        category: string
        tags: string
        store: string
    }[]
    isAdmin: boolean
}

export default function ProductsShow({ products, isAdmin }: ProductsShowProps) {
    const productDetailDialogRef = useRef<ProductDetailDialogHandles>(null)
    const createProductDialogRef = useRef<CreateProductDialogHandles>(null)

    const getProductsWithCategories = () => {
        if (products.length <= 0) return []

        let lastCategory = products[0].category

        const rows: React.ReactNode[] = [
            <div
                key={lastCategory}
                className="col-span-full flex w-full items-center gap-x-4 text-left text-xl font-semibold text-zinc-400"
            >
                <p className="shrink-0 whitespace-nowrap">{lastCategory}</p>
                <span className="h-[1px] w-full flex-grow bg-zinc-600" />
            </div>
        ]

        products.forEach(product => {
            if (lastCategory !== product.category) {
                lastCategory = product.category
                rows.push(
                    <div
                        key={product.category}
                        className="col-span-full flex w-full items-center gap-x-4 text-left text-xl font-semibold text-zinc-400"
                    >
                        <p className="shrink-0 whitespace-nowrap">
                            {product.category}
                        </p>
                        <span className="h-[1px] w-full flex-grow bg-zinc-600" />
                    </div>
                )
            }

            rows.push(
                <ProductCard
                    product={product}
                    onProductClick={() =>
                        productDetailDialogRef.current?.open({
                            name: product.name,
                            category: product.category,
                            description: product.description,
                            price: product.price,
                            tags: product.tags,
                            id: product.id
                        })
                    }
                />
            )
        })

        return rows
    }

    return (
        <>
            <div className="grid h-full flex-grow grid-cols-3 place-items-stretch gap-5 pb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {React.Children.toArray(getProductsWithCategories())}
            </div>
            <ProductDetailDialog
                ref={productDetailDialogRef}
                isAdmin={isAdmin}
                onEditClick={id => {
                    const product = products.find(item => item.id === id)
                    if (product) createProductDialogRef.current?.edit(product)
                }}
            />
            <CreateProductDialog ref={createProductDialogRef} />
        </>
    )
}
