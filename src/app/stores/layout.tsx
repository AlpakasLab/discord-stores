import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { FaDiscord } from 'react-icons/fa'
import Signout from '@/components/auth/signout'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/')
    }

    return (
        <div className="flex w-full flex-grow flex-col">
            <header className="w-full border-b border-zinc-700">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-x-3">
                        <FaDiscord className="text-3xl text-zinc-300" />
                        <p className="text-lg text-zinc-300">Discord Store</p>
                    </div>

                    <div className="flex items-center gap-x-3">
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
                        <p className="text-base text-zinc-300">
                            {session.user?.name ?? '-----'}
                        </p>
                        <Signout />
                    </div>
                </div>
            </header>
            {children}
        </div>
    )
}
