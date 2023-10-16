'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaDiscord, FaPaintBrush, FaTags, FaTruck } from 'react-icons/fa'

type ConfigurationMenuProps = {
    storeId: string
}

export default function ConfigurationMenu({ storeId }: ConfigurationMenuProps) {
    const pathname = usePathname()

    return (
        <nav className="flex w-full flex-col">
            <Link
                href={`/stores/${storeId}/configuration/products/`}
                data-active={
                    pathname === `/stores/${storeId}/configuration/products/`
                }
                className="w-full px-4 py-2 text-zinc-200 transition-all duration-300 hover:bg-zinc-700 data-[active=true]:bg-zinc-700"
            >
                <FaTags className="mr-2 inline text-lg" /> Produtos
            </Link>
            <Link
                href={`/stores/${storeId}/configuration/shipping/`}
                data-active={
                    pathname === `/stores/${storeId}/configuration/shipping/`
                }
                className="w-full px-4 py-2 text-zinc-200 transition-all duration-300 hover:bg-zinc-700 data-[active=true]:bg-zinc-700"
            >
                <FaTruck className="mr-2 inline text-lg" /> Entregas
            </Link>
            <Link
                href={`/stores/${storeId}/configuration/discord/`}
                data-active={
                    pathname === `/stores/${storeId}/configuration/discord/`
                }
                className="w-full px-4 py-2 text-zinc-200 transition-all duration-300 hover:bg-zinc-700 data-[active=true]:bg-zinc-700"
            >
                <FaDiscord className="mr-2 inline text-lg" /> Discord
            </Link>
            <Link
                href={`/stores/${storeId}/configuration/customization/`}
                data-active={
                    pathname ===
                    `/stores/${storeId}/configuration/customization/`
                }
                className="w-full px-4 py-2 text-zinc-200 transition-all duration-300 hover:bg-zinc-700 data-[active=true]:bg-zinc-700"
            >
                <FaPaintBrush className="mr-2 inline text-lg" /> Customizações
            </Link>
        </nav>
    )
}
