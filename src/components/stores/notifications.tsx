'use client'

import { Popover } from '@headlessui/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaBox, FaRegBell, FaTimes, FaTruck, FaUtensils } from 'react-icons/fa'

moment.updateLocale('en', {
    relativeTime: {
        future: 'Em %s',
        past: 'Há %s atrás',
        s: 'alguns segundos',
        ss: '%d segundos',
        m: 'um minuto',
        mm: '%d minutos',
        h: 'uma hora',
        hh: '%d horas',
        d: 'um dia',
        dd: '%d dias',
        w: 'uma semana',
        ww: '%d semanas',
        M: 'um mês',
        MM: '%d meses',
        y: 'um ano',
        yy: '%d anos'
    }
})

type Notification = {
    id: string
    title: string
    description: string
    author: string
    icon: string
    userId: string
    createdAt: string
}

const NotificationIcons: Record<string, React.ReactNode> = {
    truck: <FaTruck className="mr-3 inline text-xl text-zinc-200" />,
    utensils: <FaUtensils className="mr-3 inline text-xl text-zinc-200" />,
    box: <FaBox className="mr-3 inline text-xl text-zinc-200" />
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<null | Notification[]>(
        null
    )

    const deleteNotification = async (id: string) => {
        setNotifications(old => old?.filter(item => item.id !== id) ?? null)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/me/notifications?id=${id}`,
                {
                    method: 'DELETE'
                }
            )

            if (!response.ok) {
                toast.error('Não foi possível remover a notificação :(')
            } else {
                toast.success('Notificação lida!')
            }
        } catch (e) {
            toast.error('Não foi possível remover a notificação :(')
        }
    }

    const getNotifications = async () => {
        const request = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/me/notifications`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        if (!request.ok) setNotifications([])

        const data = await request.json()

        if (data) {
            setNotifications(data.notifications)
        }
    }

    useEffect(() => {
        if (notifications === null) {
            getNotifications()
        }
    }, [notifications])

    return (
        <Popover className="relative mr-6">
            <Popover.Button className="relative flex h-8 w-8 items-center justify-center text-xl text-zinc-300">
                <FaRegBell />
                {notifications !== null && notifications.length > 0 && (
                    <span className="absolute -top-1 left-[65%] origin-top-left rounded-md bg-red-500 px-1 text-left text-xs text-white">
                        {notifications.length}
                    </span>
                )}
            </Popover.Button>

            <Popover.Panel className="absolute right-0 top-[110%] z-10 w-96 rounded-md bg-zinc-800">
                {notifications !== null && notifications.length > 0 ? (
                    <div className="flex flex-col divide-y divide-zinc-600">
                        {React.Children.toArray(
                            notifications.map(notification => (
                                <div className="flex w-full flex-col gap-y-2 px-4 py-4">
                                    <div className="flex w-full items-center justify-between gap-x-2">
                                        <p className="flex-grow font-semibold">
                                            {
                                                NotificationIcons[
                                                    notification.icon
                                                ]
                                            }
                                            {notification.title}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                deleteNotification(
                                                    notification.id
                                                )
                                            }}
                                            title="Marcar como lido"
                                            className="text-sm font-normal text-red-600"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <p className="text-sm text-zinc-200">
                                        {notification.description}
                                    </p>
                                    <span className="text-xs text-zinc-500">
                                        {moment(
                                            notification.createdAt
                                        ).fromNow()}
                                        &nbsp;por&nbsp;
                                        {notification.author}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <p className="px-4 py-5 text-center text-zinc-500">
                        Sem notificações :(
                    </p>
                )}
            </Popover.Panel>
        </Popover>
    )
}
