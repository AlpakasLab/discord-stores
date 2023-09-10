'use client'

import { FaClock, FaCrown, FaStoreAlt } from 'react-icons/fa'
import CreateStoreDialog, {
    CreateStoreDialogHandles
} from '@/components/stores/create'
import React, { useRef } from 'react'
import { useRouter } from 'next/navigation'
import RequestEntryDialog, { RequestEntryDialogHandles } from './request'

type StoresShowProps = {
    stores: {
        active: boolean
        id: string
        name: string
        administrator: boolean
        employee: 'ACTIVE' | 'DISABLED' | 'PENDING' | null
    }[]
}

export default function StoresShow({ stores }: StoresShowProps) {
    const createStoreDialogRef = useRef<CreateStoreDialogHandles>(null)
    const requestEntryDialogRef = useRef<RequestEntryDialogHandles>(null)
    const router = useRouter()

    return (
        <>
            <div className="grid w-full max-w-md grid-cols-1 gap-5 sm:grid-cols-2">
                {React.Children.toArray(
                    stores.map(store => (
                        <button
                            disabled={!store.active && !store.administrator}
                            type="button"
                            onClick={() => {
                                if (store.active) {
                                    if (store.administrator) {
                                        router.push(`/stores/${store.id}/`)
                                    } else {
                                        if (store.employee === 'ACTIVE') {
                                            router.push(`/stores/${store.id}/`)
                                        } else {
                                            requestEntryDialogRef.current?.open(
                                                store.id
                                            )
                                        }
                                    }
                                } else {
                                    createStoreDialogRef.current?.open(store.id)
                                }
                            }}
                            className="flex items-center justify-between rounded-md bg-zinc-700 p-4 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <p className="text-lg">{store.name}</p>
                            {store.active && store.employee === 'ACTIVE' && (
                                <FaStoreAlt className="text-green-500" />
                            )}
                            {store.active && store.employee === 'PENDING' && (
                                <FaClock className="text-orange-500" />
                            )}
                            {store.active && store.administrator && (
                                <FaCrown className="text-yellow-500" />
                            )}
                        </button>
                    ))
                )}
            </div>
            <CreateStoreDialog ref={createStoreDialogRef} />
            <RequestEntryDialog ref={requestEntryDialogRef} />
        </>
    )
}
