import StoresShow from '@/components/stores/show'
import { getUserStores } from '@/services/stores'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Lojas'
}

export default async function Stores() {
    const stores = await getUserStores()

    return (
        <div className="container relative my-20 flex h-full w-full flex-grow flex-col items-center justify-center">
            <p className="mb-10 mt-1 text-xl text-zinc-300">Lojas</p>
            <StoresShow stores={stores} />
        </div>
    )
}
