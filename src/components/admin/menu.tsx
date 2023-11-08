'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FaBell, FaCreditCard } from 'react-icons/fa'

type MenuItemProps = {
    title: string
    route: string
    icon: React.ReactNode
}

export default function Menu() {
    return (
        <ul className="flex h-full items-center justify-start">
            <li>
                <MenuItem
                    title="Notificações"
                    route={'/admin/notifications/'}
                    icon={<FaBell className="text-lg" />}
                />
            </li>
            <li>
                <MenuItem
                    title="Pagamentos"
                    route={'/admin/payments/'}
                    icon={<FaCreditCard className="text-lg" />}
                />
            </li>
        </ul>
    )
}

function MenuItem({ title, route, icon }: MenuItemProps) {
    const pathname = usePathname()

    return (
        <Link
            href={route}
            data-active={pathname === route}
            className="relative flex h-full items-center justify-center gap-x-4 px-2 py-2 text-sm after:absolute after:-bottom-0.5 after:block after:h-0.5 after:w-full after:bg-cyan-500 after:opacity-0 after:transition-all after:duration-300 data-[active=true]:after:opacity-100 md:px-4"
        >
            {icon} {title}
        </Link>
    )
}
