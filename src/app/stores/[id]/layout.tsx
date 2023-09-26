import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { StoreContextProvider } from '@/components/store/context'
import Menu from '@/components/store/menu'
import { getStoreData } from '@/services/stores'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StoreLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)
    const {
        name: storeName,
        primaryColor,
        secondaryColor
    } = await getStoreData(params.id)

    return (
        <StoreContextProvider
            storeId={params.id}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
        >
            <div className="flex w-full flex-grow flex-col">
                <header className="w-full border-b border-zinc-700">
                    <div className="container hidden items-center gap-x-4 md:flex md:gap-x-8">
                        <Link
                            href="/stores/"
                            title="Trocar de Loja"
                            className="py-2 text-base"
                        >
                            {storeName}
                        </Link>
                        <span>/</span>
                        <Menu
                            isAdmin={session?.user.role === 'ADMIN'}
                            storeId={params.id}
                        />
                    </div>
                </header>
                {children}
            </div>
        </StoreContextProvider>
    )
}
