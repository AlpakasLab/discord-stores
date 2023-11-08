import NotificationForm from '@/components/admin/notification'
import { getAdmins } from '@/services/admin'
import { Metadata } from 'next'
import React from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Notificações'
}

export default async function Admin() {
    const admins = await getAdmins()

    return (
        <div className="container relative flex h-full w-full flex-grow flex-col items-center justify-center py-5">
            <p className="pb-4 text-lg font-semibold">Nova Notificação</p>
            <NotificationForm admins={admins} />
        </div>
    )
}
