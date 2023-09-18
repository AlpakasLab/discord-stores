import NewEmployeeRole from '@/components/employees/roles/new'
import ShowEmployeeRoles from '@/components/employees/roles/show'
import ShowEmployees from '@/components/employees/show'
import { getEmployee, getEmployeeRoles } from '@/services/employees'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Funcionários'
}

export default async function Employees({
    params
}: {
    params: { id: string }
}) {
    const roles = await getEmployeeRoles(params.id)
    const employees = await getEmployee(params.id)

    return (
        <div className="container relative mt-5 grid h-full w-full flex-grow grid-cols-1 place-content-start gap-5 lg:grid-cols-3">
            <div className="h-fit rounded-md border border-zinc-700 p-4">
                <div className="flex w-full items-center justify-between">
                    <p className="font-semibold">Cargos ({roles.length})</p>
                    <div className="max-w-xs">
                        <NewEmployeeRole />
                    </div>
                </div>
                <ShowEmployeeRoles roles={roles} />
            </div>
            <div className="h-fit rounded-md border border-zinc-700 p-4 lg:col-span-2">
                <div className="flex w-full items-center justify-between">
                    <p className="font-semibold">
                        Funcionários ({employees.length})
                    </p>
                </div>
                <ShowEmployees employees={employees} />
            </div>
        </div>
    )
}
