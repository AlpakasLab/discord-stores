import { numberToMoney } from '@/utils/formatter'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaCameraRetro } from 'react-icons/fa'
import { useStockContext } from './context'

type ItemCardProps = {
    item: {
        id: string
        name: string
        image: string | null
        category: string
    }
    onItemClick: () => void
}

export default function ItemCard({ item, onItemClick }: ItemCardProps) {
    const { items, dispatchStock } = useStockContext()
    const [quantity, setQuantity] = useState<number | null>(null)

    useEffect(() => {
        const itemSaved = items.find(stockItem => stockItem.id === item.id)

        if (!itemSaved && quantity !== null) {
            setQuantity(null)
        }
    }, [item.id, items, quantity])

    return (
        <div className="group relative flex h-full w-full flex-col items-stretch justify-between overflow-hidden rounded-md border border-zinc-800 p-2">
            <button
                onClick={() => onItemClick()}
                type="button"
                className="flex flex-col items-start group-data-[disabled=true]:opacity-50"
                title="Clique para ver mais detalhes"
            >
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-zinc-800">
                    {item.image ? (
                        <Image
                            src={item.image}
                            className="object-cover object-center"
                            fill
                            alt={item.name}
                        />
                    ) : (
                        <FaCameraRetro className="text-3xl text-zinc-600" />
                    )}
                </div>
                <p className="mt-2 w-full text-left text-base font-bold sm:text-lg">
                    {item.name}
                </p>
            </button>
            <input
                className="mt-4 w-full rounded-md border border-zinc-600 bg-zinc-700 p-2 text-sm font-normal text-white focus:border-zinc-600 focus:shadow-none focus:ring-transparent disabled:cursor-not-allowed disabled:opacity-50"
                value={quantity ?? ''}
                placeholder="Quantidade"
                type="number"
                onChange={e => {
                    const valueInNumber = Math.round(Number(e.target.value))
                    setQuantity(valueInNumber === 0 ? null : valueInNumber)

                    dispatchStock(valueInNumber === 0 ? 'REMOVE' : 'CHANGE', {
                        id: item.id,
                        name: item.name,
                        quantity: valueInNumber ?? 0
                    })
                }}
            />
        </div>
    )
}
