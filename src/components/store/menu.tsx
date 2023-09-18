'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useStoreContext } from './context'
import { FaCog, FaHamburger, FaShoppingBasket, FaUsers } from 'react-icons/fa'

type MenuProps = {
    isAdmin: boolean
    storeId: string
}

type MenuItemProps = {
    title: string
    route: string
    icon: React.ReactNode
}

export default function Menu({ isAdmin, storeId }: MenuProps) {
    const { isManager } = useStoreContext()

    return (
        <ul className="flex h-full items-center justify-start">
            <li>
                <MenuItem
                    title="Produtos"
                    route={`/stores/${storeId}/`}
                    icon={<FaHamburger className="text-lg" />}
                />
            </li>
            {isManager && (
                <>
                    <li>
                        <MenuItem
                            title="Funcionarios"
                            route={`/stores/${storeId}/employees/`}
                            icon={<FaUsers className="text-lg" />}
                        />
                    </li>
                    <li>
                        <MenuItem
                            title="Vendas"
                            route={`/stores/${storeId}/orders/`}
                            icon={<FaShoppingBasket className="text-lg" />}
                        />
                    </li>
                </>
            )}
            {isAdmin && (
                <li>
                    <MenuItem
                        title="Configurações"
                        route={`/stores/${storeId}/configuration/`}
                        icon={<FaCog className="text-lg" />}
                    />
                </li>
            )}
        </ul>
    )
}

function MenuItem({ title, route, icon }: MenuItemProps) {
    const pathname = usePathname()
    const { themed } = useStoreContext()

    return (
        <Link
            href={route}
            data-active={pathname === route}
            data-themed={themed}
            className="relative flex h-full items-center justify-center gap-x-4 px-2 py-2 text-sm after:absolute after:-bottom-0.5 after:block after:h-0.5 after:w-full after:bg-cyan-500 after:opacity-0 after:transition-all after:duration-300 data-[themed=true]:after:bg-custom-primary data-[active=true]:after:opacity-100 md:px-4"
        >
            {icon} {title}
        </Link>
    )
}
