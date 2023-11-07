import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Administração'
}

export default async function Admin() {
    return (
        <div className="container relative my-20 flex h-full w-full flex-grow flex-col items-center justify-center">
            <p className="mb-10 mt-1 text-xl text-zinc-300">Administração</p>
        </div>
    )
}
