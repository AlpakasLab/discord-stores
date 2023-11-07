import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import ConfigurationMenu from '@/components/configuration/menu'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ConfigurationLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session || (session && session.user.role === 'SELLER')) {
        redirect('/')
    }

    return (
        <div className="container mt-5 flex w-full flex-grow flex-row items-start gap-x-5">
            <aside className="w-60 shrink-0 overflow-hidden rounded-md border border-zinc-700">
                <ConfigurationMenu storeId={params.id} />
            </aside>
            {children}
        </div>
    )
}
