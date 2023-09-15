'use client'

import React, { useRef } from 'react'
import ProductCard from './card'
import ProductDetailDialog, { ProductDetailDialogHandles } from './detail'
import CreateProductDialog, { CreateProductDialogHandles } from './create'
import tinycolor from 'tinycolor2'

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
    tagsColors: {
        name: string
        id: string
        color: string | null
    }[]
}

export default function ProductsShow({
    products,
    tagsColors
}: ProductsShowProps) {
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
                    tags={
                        React.Children.toArray(
                            product.tags?.split(',').map(tag => {
                                const tagData = tagsColors.find(
                                    tagColor => tagColor.name === tag
                                )

                                return (
                                    <span
                                        style={
                                            tagData && tagData.color
                                                ? {
                                                      backgroundColor:
                                                          tagData.color,
                                                      color: tinycolor(
                                                          tagData.color
                                                      ).isDark()
                                                          ? '#FFF'
                                                          : '#18181b'
                                                  }
                                                : undefined
                                        }
                                        className="rounded-md bg-red-500/40 px-1 py-0.5 text-xs odd:bg-cyan-500/40"
                                    >
                                        {tag}
                                    </span>
                                )
                            })
                        ) ?? []
                    }
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
            <div className="grid h-full flex-grow grid-cols-2 place-items-stretch gap-3 pb-10 sm:grid-cols-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {React.Children.toArray(getProductsWithCategories())}
            </div>
            <ProductDetailDialog
                ref={productDetailDialogRef}
                onEditClick={id => {
                    const product = products.find(item => item.id === id)
                    if (product) createProductDialogRef.current?.edit(product)
                }}
            />
            <CreateProductDialog ref={createProductDialogRef} />
        </>
    )
}
