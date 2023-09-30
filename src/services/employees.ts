import { db } from '@/providers/database/client'
import { accounts, employeeRoles, employees } from '@/providers/database/schema'
import { and, desc, eq } from 'drizzle-orm'

export async function getEmployeeRoles(store: string) {
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

export async function getEmployeeData(id: string, access_token?: string) {
    if (!access_token) {
        return {
            isManager: false,
            comission: null
        }
    }

    try {
        const userRegisters = await db
            .select({
                manager: employeeRoles.manager,
                comission: employeeRoles.comission
            })
            .from(accounts)
            .where(eq(accounts.access_token, access_token))
            .innerJoin(
                employees,
                and(
                    eq(employees.userId, accounts.userId),
                    eq(employees.storeId, id)
                )
            )
            .innerJoin(
                employeeRoles,
                eq(employeeRoles.id, employees.employeeRoleId)
            )

        const user = userRegisters.at(0)

        if (user) {
            return {
                isManager: user.manager === true,
                comission: user.comission
            }
        } else {
            throw new Error('Cannot get employee data')
        }
    } catch (error) {
        throw new Error('Cannot get employee data')
    }
}
