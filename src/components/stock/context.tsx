'use client'

import { StockItem } from '@/entities/item'
import React, { createContext, useContext, useState } from 'react'

type StockContextData = {
    items: StockItem[]
    dispatchStock: (
        action: 'RESET' | 'CHANGE' | 'REMOVE',
        value?: StockItem
    ) => void
}

const StockContext = createContext<StockContextData | null>(null)

type StockContextProviderProps = {
    children: React.ReactNode
}

export const StockContextProvider = ({
    children
}: StockContextProviderProps) => {
    const [items, setItems] = useState(new Map<string, StockItem>())

    const dispatchStock = (
        action: 'RESET' | 'CHANGE' | 'REMOVE',
        value?: StockItem
    ) => {
        if (action === 'RESET') {
            setItems(new Map<string, StockItem>())
        } else if (action === 'CHANGE' && value) {
            setItems(old => {
                old.set(value.id, value)
                return new Map(old)
            })
        } else if (action === 'REMOVE' && value) {
            setItems(old => {
                old.delete(value.id)
                return new Map(old)
            })
        }
    }

    return (
        <StockContext.Provider
            value={{ items: Array.from(items.values()), dispatchStock }}
        >
            {children}
        </StockContext.Provider>
    )
}

export const useStockContext = () => {
    const context = useContext(StockContext)

    if (!context)
        throw Error(
            'StockContext cannot be used outside a StockContextProvider'
        )

    return context
}
