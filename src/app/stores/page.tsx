import StoresShow from '@/components/stores/show'
import { getUserStores } from '@/services/stores'
import React from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Stores() {
    const stores = await getUserStores()

    return (
        <div className="container relative mt-20 flex h-full w-full flex-grow flex-col items-center justify-center">
            <p className="mb-10 mt-1 text-xl text-zinc-300">Servidores</p>
            <StoresShow stores={stores} />
        </div>
    )
}
