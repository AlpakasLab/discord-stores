'use client'

import React, { useCallback, useRef, useState } from 'react'
import CreateItemDialog, { CreateItemDialogHandles } from './create'
import Button from '../inputs/button'
import { useStoreContext } from '../store/context'
import TextInput from '../inputs/text'
import { FaRegTimesCircle } from 'react-icons/fa'
import ItemCard from './card'
import ItemDetailDialog, { ItemDetailDialogHandles } from './detail'
import DeleteItemDialog, { DeleteItemDialogHandles } from './delete'

type ItemsShowProps = {
    items: {
        id: string
        name: string
        image: string | null
        category: string
        store: string
    }[]
    storeId: string
}

export default function ItemsShow({ items, storeId }: ItemsShowProps) {
    const { themed, isManager } = useStoreContext()
    const itemDetailDialogRef = useRef<ItemDetailDialogHandles>(null)
    const createItemDialogRef = useRef<CreateItemDialogHandles>(null)
    const deleteItemDialogRef = useRef<DeleteItemDialogHandles>(null)

    const [filters, setFilters] = useState({
        name: '',
        category: 'all'
    })

    const getItemsWithCategories = useCallback(() => {
        if (items.length <= 0) return []

        const filteredItems = items.filter(item =>
            item.name
                .toLocaleLowerCase()
                .includes(filters.name.toLocaleLowerCase())
        )

        if (filteredItems.length <= 0) {
            return (
                <div className="col-span-full flex w-full items-center justify-center gap-x-2 py-10 text-left text-xl font-semibold text-zinc-600">
                    <FaRegTimesCircle />
                    <p>Sem Resultados</p>
                </div>
            )
        }

        let lastCategory = filteredItems[0].category

        const rows: React.ReactNode[] = [
            <div
                key={lastCategory}
                className="col-span-full flex w-full items-center gap-x-4 text-left text-xl font-semibold text-zinc-400"
            >
                <p className="shrink-0 whitespace-nowrap">{lastCategory}</p>
                <span className="h-[1px] w-full flex-grow bg-zinc-600" />
            </div>
        ]

        filteredItems.forEach(item => {
            if (lastCategory !== item.category) {
                lastCategory = item.category
                rows.push(
                    <div
                        key={item.category}
                        className="col-span-full flex w-full items-center gap-x-4 text-left text-xl font-semibold text-zinc-400"
                    >
                        <p className="shrink-0 whitespace-nowrap">
                            {item.category}
                        </p>
                        <span className="h-[1px] w-full flex-grow bg-zinc-600" />
                    </div>
                )
            }

            rows.push(
                <ItemCard
                    item={item}
                    onItemClick={() =>
                        itemDetailDialogRef.current?.open({
                            name: item.name,
                            category: item.category,
                            id: item.id
                        })
                    }
                />
            )
        })

        return rows
    }, [filters.name, items])

    return (
        <>
            <header className="z-10 flex w-full items-center justify-between gap-x-10 bg-zinc-900 pb-5">
                <p className="shrink-0 text-lg font-bold sm:text-xl">
                    Items ({items.length})
                </p>
                <div className="flex w-full max-w-md flex-grow items-center gap-x-5">
                    <TextInput
                        onChange={e =>
                            setFilters(old => ({
                                ...old,
                                name: e.target.value.trim()
                            }))
                        }
                        placeholder="Nome do Item"
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
                                    createItemDialogRef.current?.open(storeId)
                                }
                            />
                        </div>
                    )}
                </div>
            </header>
            <div className="grid h-full flex-grow grid-cols-2 place-items-stretch gap-3 pb-10 sm:grid-cols-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {React.Children.toArray(getItemsWithCategories())}
            </div>
            <ItemDetailDialog
                ref={itemDetailDialogRef}
                onEditClick={id => {
                    const item = items.find(item => item.id === id)
                    if (item) createItemDialogRef.current?.edit(item)
                }}
                onDeleteClick={id => {
                    const item = items.find(item => item.id === id)
                    if (item)
                        deleteItemDialogRef.current?.open({
                            id: id,
                            name: item.name
                        })
                }}
            />
            <CreateItemDialog ref={createItemDialogRef} />
            <DeleteItemDialog ref={deleteItemDialogRef} />
        </>
    )
}
