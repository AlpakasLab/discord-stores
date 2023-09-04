import { getStoreName } from '@/services/stores'
import Link from 'next/link'
import { FaCog, FaHamburger, FaUsers } from 'react-icons/fa'

export default async function StoreLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { id: string }
}) {
    const storeName = await getStoreName(params.id)

    return (
        <div className="flex w-full flex-grow flex-col">
            <header className="w-full border-b border-zinc-700">
                <div className="container flex items-center gap-x-10 py-2">
                    <Link
                        href="/stores/"
                        title="Trocar de Loja"
                        className="text-lg"
                    >
                        {storeName}
                    </Link>
                    <span>/</span>
                    <ul className="flex items-center justify-start gap-x-10">
                        <li>
                            <Link
                                href={`/stores/${params.id}/`}
                                className="flex items-center gap-x-4 text-sm"
                            >
                                <FaHamburger className="text-lg" /> Produtos
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/stores/${params.id}/employees`}
                                className="flex items-center gap-x-4 text-sm"
                            >
                                <FaUsers className="text-xl" /> Funcionarios
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/stores/${params.id}/configuration`}
                                className="flex items-center gap-x-4 text-sm"
                            >
                                <FaCog className="text-xl" /> Configurações
                            </Link>
                        </li>
                    </ul>
                </div>
            </header>
            {children}
        </div>
    )
}
