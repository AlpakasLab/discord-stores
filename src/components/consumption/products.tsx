'use client'

import React, { useCallback, useState } from 'react'
import ProductCard from './card'
import TextInput from '../inputs/text'
import { FaRegTimesCircle } from 'react-icons/fa'
type ConsumptionProductsProps = {
    products: {
        id: string
        name: string
        description: string | null
        price: number
        promotionalPrice: number | null
        employeeComission: number | null
        image: string | null
        active: boolean
        category: string
        tags: string
        store: string
    }[]
}

export default function ConsumptionProducts({
    products
}: ConsumptionProductsProps) {
    const [filters, setFilters] = useState({
        name: ''
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

            rows.push(<ProductCard product={product} />)
        })

        return rows
    }, [filters.name, products])

    return (
        <>
            <header className="z-10 flex w-full items-center justify-between gap-x-10 bg-zinc-900 pb-5">
                <p className="shrink-0 text-lg font-bold sm:text-xl">
                    Produtos ({products.length})
                </p>
                <div className="flex w-full max-w-xs flex-grow items-center gap-x-5">
                    <TextInput
                        onChange={e =>
                            setFilters(old => ({
                                ...old,
                                name: e.target.value.trim()
                            }))
                        }
                        placeholder="Nome do Produto"
                    />
                </div>
            </header>
            <div className="grid h-full flex-grow grid-cols-2 place-items-stretch gap-3 pb-10 sm:grid-cols-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {React.Children.toArray(getProductsWithCategories())}
            </div>
        </>
    )
}
