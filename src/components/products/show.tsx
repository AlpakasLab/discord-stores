'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import ProductCard from './card'
import ProductDetailDialog, { ProductDetailDialogHandles } from './detail'
import CreateProductDialog, { CreateProductDialogHandles } from './create'
import tinycolor from 'tinycolor2'
import Button from '../inputs/button'
import { useStoreContext } from '../store/context'
import TextInput from '../inputs/text'
import SelectInput from '../inputs/select'
import { FaRegTimesCircle } from 'react-icons/fa'
import DeleteProductDialog, { DeleteProductDialogHandles } from './delete'

type ProductsShowProps = {
    products: {
        id: string
        name: string
        description: string | null
        price: number
        promotionalPrice: number | null
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
    storeId: string
}

export default function ProductsShow({
    products,
    tagsColors,
    storeId
}: ProductsShowProps) {
    const { themed, isManager } = useStoreContext()
    const productDetailDialogRef = useRef<ProductDetailDialogHandles>(null)
    const createProductDialogRef = useRef<CreateProductDialogHandles>(null)
    const deleteProductDialogRef = useRef<DeleteProductDialogHandles>(null)

    const [filters, setFilters] = useState({
        name: '',
        category: 'all'
    })

    const getProductsWithCategories = useCallback(() => {
        if (products.length <= 0) return []

        const filteredProducts = products.filter(product =>
            product.name
                .toLocaleLowerCase()
                .includes(filters.name.toLocaleLowerCase())
        )

        if (filteredProducts.length <= 0) {
            return (
                <div className="col-span-full flex w-full items-center justify-center gap-x-2 py-10 text-left text-xl font-semibold text-zinc-600">
                    <FaRegTimesCircle />
                    <p>Sem Resultados</p>
                </div>
            )
        }

        let lastCategory = filteredProducts[0].category

        const rows: React.ReactNode[] = [
            <div
                key={lastCategory}
                className="col-span-full flex w-full items-center gap-x-4 text-left text-xl font-semibold text-zinc-400"
            >
                <p className="shrink-0 whitespace-nowrap">{lastCategory}</p>
                <span className="h-[1px] w-full flex-grow bg-zinc-600" />
            </div>
        ]

        filteredProducts.forEach(product => {
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
                            product.tags
                                ?.split(',')
                                .sort()
                                .map(tag => {
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
                            promotionalPrice: product.promotionalPrice,
                            tags: product.tags,
                            id: product.id
                        })
                    }
                />
            )
        })

        return rows
    }, [filters.name, products, tagsColors])

    return (
        <>
            <header className="z-10 flex w-full items-center justify-between bg-zinc-900 pb-5">
                <p className="text-lg font-bold sm:text-xl">
                    Produtos ({products.length})
                </p>
                <div className="flex items-center gap-x-5">
                    <TextInput
                        onChange={e =>
                            setFilters(old => ({
                                ...old,
                                name: e.target.value.trim()
                            }))
                        }
                        placeholder="Nome do Produto"
                    />
                    {isManager && (
                        <div className="max-w-[10rem]">
                            <Button
                                component="button"
                                type="button"
                                text="Cadastrar"
                                size="sm"
                                color={
                                    themed ? 'custom-secondary' : 'secondary'
                                }
                                onClick={() =>
                                    createProductDialogRef.current?.open(
                                        storeId
                                    )
                                }
                            />
                        </div>
                    )}
                </div>
            </header>
            <div className="grid h-full flex-grow grid-cols-2 place-items-stretch gap-3 pb-10 sm:grid-cols-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {React.Children.toArray(getProductsWithCategories())}
            </div>
            <ProductDetailDialog
                ref={productDetailDialogRef}
                onEditClick={id => {
                    const product = products.find(item => item.id === id)
                    if (product) createProductDialogRef.current?.edit(product)
                }}
                onDeleteClick={id => {
                    const product = products.find(item => item.id === id)
                    if (product)
                        deleteProductDialogRef.current?.open({
                            id: id,
                            name: product.name
                        })
                }}
            />
            <CreateProductDialog ref={createProductDialogRef} />
            <DeleteProductDialog ref={deleteProductDialogRef} />
        </>
    )
}
