'use client'

import { FaStoreAlt, FaStoreAltSlash } from 'react-icons/fa'
import CreateStoreDialog, {
    CreateStoreDialogHandles
} from '@/components/stores/create'
import React, { useRef } from 'react'
import { useRouter } from 'next/navigation'

type StoresShowProps = {
    stores: {
        active: boolean
        id: string
        name: string
        administrator: boolean
    }[]
}

export default function StoresShow({ stores }: StoresShowProps) {
    const createStoreDialogRef = useRef<CreateStoreDialogHandles>(null)
    const router = useRouter()

    const createStore = async (id: string) => {
        createStoreDialogRef.current?.open(id)
    }

    return (
        <>
            <div className="grid w-full max-w-md grid-cols-2 gap-5">
                {React.Children.toArray(
                    stores.map(store => (
                        <button
                            disabled={!store.active && !store.administrator}
                            type="button"
                            title={
                                store.active
                                    ? 'Loja encontrada'
                                    : 'Loja ainda não cadastrada'
                            }
                            onClick={async () => {
                                if (store.active) {
                                    router.push(`/stores/${store.id}/`)
                                } else {
                                    await createStore(store.id)
                                }
                            }}
                            className="flex items-center justify-between rounded-md bg-zinc-700 p-4 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <p className="text-lg">{store.name}</p>
                            {store.active ? (
                                <FaStoreAlt className="text-green-500" />
                            ) : (
                                <FaStoreAltSlash className="text-red-500" />
                            )}
                        </button>
                    ))
                )}
            </div>
            <CreateStoreDialog ref={createStoreDialogRef} />
        </>
    )
}
