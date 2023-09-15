import { numberToMoney } from '@/utils/formatter'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaCameraRetro } from 'react-icons/fa'
import { useSellContext } from '../sell/context'

type ProductCardProps = {
    product: {
        id: string
        name: string
        description: string | null
        price: number
        promotionalPrice: number | null
        image: string | null
        active: boolean
        category: string
        tags: string
    }
    tags: React.ReactNode[]
    onProductClick: () => void
}

export default function ProductCard({
    product,
    tags,
    onProductClick
}: ProductCardProps) {
    const { items, dispatchSell } = useSellContext()
    const [quantity, setQuantity] = useState<number | null>(null)

    useEffect(() => {
        const item = items.find(item => item.id === product.id)

        if (!item && quantity !== null) {
            setQuantity(null)
        }
    }, [items, product.id, quantity])

    return (
        <div
            data-disabled={product.active !== true}
            className="group relative flex h-full w-full flex-col items-stretch justify-between overflow-hidden rounded-md border border-zinc-800 p-2"
        >
            {product.active !== true && (
                <span className="absolute left-11 top-8 z-10 w-[100%] rotate-[35deg] bg-red-600 py-0.5 text-center text-sm font-semibold text-white">
                    Produto Esgotado
                </span>
            )}
            <button
                onClick={() => onProductClick()}
                type="button"
                className="flex flex-col items-start group-data-[disabled=true]:opacity-50"
                title="Clique para ver mais detalhes"
            >
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-zinc-800">
                    {product.image ? (
                        <Image
                            src={product.image}
                            className="object-cover object-center"
                            fill
                            alt={product.name}
                        />
                    ) : (
                        <FaCameraRetro className="text-3xl text-zinc-600" />
                    )}
                </div>
                <p className="mt-2 w-full text-left text-base font-bold sm:text-lg">
                    {product.name}
                </p>
                <p className="flex w-full flex-col text-left text-sm font-semibold text-green-600 sm:text-base">
                    {product.promotionalPrice !== null ? (
                        <>
                            <span className="text-xs text-zinc-500 line-through">
                                {numberToMoney(product.price)}
                            </span>
                            {numberToMoney(product.promotionalPrice)}
                        </>
                    ) : (
                        numberToMoney(product.price)
                    )}
                </p>
            </button>
            <div className="mb-2 mt-2 flex h-full flex-wrap items-start justify-start gap-1 group-data-[disabled=true]:opacity-50">
                {tags}
            </div>
            <input
                className="w-full rounded-md border border-zinc-600 bg-zinc-700 p-2 text-sm font-normal text-white focus:border-zinc-600 focus:shadow-none focus:ring-transparent disabled:cursor-not-allowed disabled:opacity-50"
                value={quantity ?? ''}
                disabled={product.active !== true}
                placeholder="Quantidade"
                type="number"
                min={0}
                onChange={e => {
                    const valueInNumber = Math.round(Number(e.target.value))
                    setQuantity(valueInNumber <= 0 ? null : valueInNumber)

                    dispatchSell(valueInNumber <= 0 ? 'REMOVE' : 'CHANGE', {
                        id: product.id,
                        name: product.name,
                        quantity: valueInNumber ?? 0,
                        unitPrice: product.promotionalPrice ?? product.price
                    })
                }}
            />
        </div>
    )
}
