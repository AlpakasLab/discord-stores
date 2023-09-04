'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type MenuItemProps = {
    title: string
    route: string
    icon: React.ReactNode
}

export function MenuItem({ title, route, icon }: MenuItemProps) {
    const pathname = usePathname()

    return (
        <Link
            href={route}
            data-active={pathname === route}
            className="relative flex h-full items-center justify-center gap-x-4 px-4 py-2 text-sm after:absolute after:-bottom-0.5 after:block after:h-0.5 after:w-full after:bg-cyan-500 after:opacity-0 after:transition-all after:duration-300 data-[active=true]:after:opacity-100"
        >
            {icon} {title}
        </Link>
    )
}
