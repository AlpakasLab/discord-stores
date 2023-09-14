import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { StoreContextProvider } from '@/components/store/context'
import { MenuItem } from '@/components/store/menu'
import { getStoreName } from '@/services/stores'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { FaCog, FaHamburger, FaUsers } from 'react-icons/fa'

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
    const storeName = await getStoreName(params.id)

    return (
        <StoreContextProvider storeId={params.id}>
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
                        <ul className="flex h-full items-center justify-start">
                            <li>
                                <MenuItem
                                    title="Produtos"
                                    route={`/stores/${params.id}/`}
                                    icon={<FaHamburger className="text-lg" />}
                                />
                            </li>
                            {session && session.user.role === 'ADMIN' && (
                                <>
                                    <li>
                                        <MenuItem
                                            title="Funcionarios"
                                            route={`/stores/${params.id}/employees/`}
                                            icon={
                                                <FaUsers className="text-lg" />
                                            }
                                        />
                                    </li>
                                    <li>
                                        <MenuItem
                                            title="Configurações"
                                            route={`/stores/${params.id}/configuration/`}
                                            icon={<FaCog className="text-lg" />}
                                        />
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </header>
                {children}
            </div>
        </StoreContextProvider>
    )
}
