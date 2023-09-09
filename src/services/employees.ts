import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { employeeRoles, employees } from '@/providers/database/schema'
import { desc, eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'

export async function getEmployeeRoles(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    try {
        const rolesRegistred = await db
            .select({
                name: employeeRoles.name,
                comission: employeeRoles.comission,
                manager: employeeRoles.manager,
                id: employeeRoles.id,
                store: employeeRoles.storeId
            })
            .from(employeeRoles)
            .where(eq(employeeRoles.storeId, store))
            .orderBy(desc(employeeRoles.comission))

        return rolesRegistred
    } catch (error) {
        throw new Error('Cannot get roles')
    }
}

export async function getEmployee(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    try {
        const employeesRegistred = await db
            .select({
                name: employees.name,
                status: employees.status,
                role: employeeRoles.name,
                roleId: employeeRoles.id,
                id: employees.id,
                store: employees.storeId
            })
            .from(employees)
            .where(eq(employees.storeId, store))
            .orderBy(employees.name)
            .leftJoin(
                employeeRoles,
                eq(employeeRoles.id, employees.employeeRoleId)
            )

        return employeesRegistred
    } catch (error) {
        throw new Error('Cannot get employees')
    }
}
