import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { FaDiscord, FaGem } from 'react-icons/fa'
import Signout from '@/components/auth/signout'
import Image from 'next/image'
import Notifications from '@/components/stores/notifications'
import SessionError from '@/components/auth/session'
import Link from 'next/link'
import Menu from '@/components/admin/menu'
import { authOptions } from '@/core/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'MASTER') {
        redirect('/')
    }

    return (
        <div className="flex w-full flex-grow flex-col">
            <header className="w-full border-b border-zinc-700">
                <div className="container flex h-14 items-center justify-between">
                    <Link href="/stores/" className="flex items-center gap-x-3">
                        <FaDiscord className="text-3xl text-zinc-300" />
                        <p className="hidden text-lg text-zinc-300 sm:inline">
                            Discord Store
                        </p>
                    </Link>

                    <div className="flex items-center sm:gap-x-3">
                        {session.user.role === 'MASTER' && (
                            <Link
                                href="/admin/"
                                className="mr-6 flex items-center gap-x-2 rounded-md text-emerald-500 transition-all duration-300"
                            >
                                <FaGem /> Administração
                            </Link>
                        )}
                        {session.error === undefined && <Notifications />}
                        {session.user.image && (
                            <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                <Image
                                    src={session.user.image}
                                    fill
                                    className="object-cover object-center"
                                    alt="User image"
                                />
                            </div>
                        )}
                        <p className="hidden text-base text-zinc-300 sm:inline">
                            {session.user?.name ?? '-----'}
                        </p>
                        <Signout />
                    </div>
                </div>
            </header>
            <div className="flex w-full flex-grow flex-col">
                <header className="w-full border-b border-zinc-700">
                    <div className="container hidden items-center gap-x-4 md:flex md:gap-x-8">
                        <p className="py-2 text-base">Administração</p>
                        <span>/</span>
                        <Menu />
                    </div>
                </header>
                {session.error ? <SessionError /> : children}
            </div>
        </div>
    )
}
