import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import NewEmployeeRole from '@/components/employees/roles/new'
import ShowEmployeeRoles from '@/components/employees/roles/show'
import { getEmployeeRoles } from '@/services/employees'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Employees({
    params
}: {
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)
    const roles = await getEmployeeRoles(params.id)

    if (!session || (session && session.user.role !== 'ADMIN')) {
        redirect('/')
    }

    return (
        <div className="container relative mt-5 grid h-full w-full flex-grow grid-cols-3 place-content-start gap-5">
            <div className="h-fit rounded-md border border-zinc-700 p-4">
                <div className="flex w-full items-center justify-between">
                    <p className="font-semibold">Cargos ({roles.length})</p>
                    <div className="max-w-xs">
                        <NewEmployeeRole />
                    </div>
                </div>
                <ShowEmployeeRoles roles={roles} />
            </div>
            <div className="col-span-2 h-fit rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">Funcionários</p>
            </div>
        </div>
    )
}
