'use client'

import { OrderItem } from '@/entities/order'
import React, { createContext, useContext, useState } from 'react'

type SellContextData = {
    items: OrderItem[]
    dispatchSell: (
        action: 'RESET' | 'CHANGE' | 'REMOVE',
        value?: OrderItem
    ) => void
}

const SellContext = createContext<SellContextData | null>(null)

type SellContextProviderProps = {
    children: React.ReactNode
}

export const SellContextProvider = ({ children }: SellContextProviderProps) => {
    const [items, setItems] = useState(new Map<string, OrderItem>())

    const dispatchSell = (
        action: 'RESET' | 'CHANGE' | 'REMOVE',
        value?: OrderItem
    ) => {
        if (action === 'RESET') {
            setItems(new Map<string, OrderItem>())
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
        <SellContext.Provider
            value={{ items: Array.from(items.values()), dispatchSell }}
        >
            {children}
        </SellContext.Provider>
    )
}

export const useSellContext = () => {
    const context = useContext(SellContext)

    if (!context)
        throw Error('SellContext cannot be used outside a SellContextProvider')

    return context
}
