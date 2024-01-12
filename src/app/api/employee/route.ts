import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/core/auth'
import { db } from '@/providers/database/client'
import {
    discordWebhooks,
    employeeRoles,
    employees,
    orders
} from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'
import { EmployeeSchema } from '@/entities/employee'
import { sendLogsMessage } from '@/services/logs'

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const requestUrl = new URL(request.url)
    const employeeId = requestUrl.searchParams.get('id')

    if (!employeeId)
        return NextResponse.json(
            { error: 'Employee id is not provided' },
            { status: 400 }
        )

    const userRegisters = await db
        .select({
            employee: employees.name
        })
        .from(employees)
        .where(eq(employees.userId, session.user.id))

    const lastUpdateEmployees = await db
        .select({
            status: employees.status,
            name: employees.name,
            role: employeeRoles.name,
            store: employees.storeId
        })
        .from(employees)
        .where(eq(employees.id, employeeId))
        .innerJoin(
            employeeRoles,
            eq(employeeRoles.id, employees.employeeRoleId)
        )

    const lastUpdateEmployee = lastUpdateEmployees.at(0)
    const user = userRegisters.at(0)

    if (!lastUpdateEmployee || !user)
        return NextResponse.json(
            { error: 'Employee not found' },
            { status: 404 }
        )

    const hooksRegistred = await db
        .select({
            url: discordWebhooks.url
        })
        .from(discordWebhooks)
        .where(
            and(
                eq(discordWebhooks.storeId, lastUpdateEmployee.store),
                eq(discordWebhooks.category, 'LOGS')
            )
        )

    const logsHook = hooksRegistred.at(0)

    if (!logsHook)
        return NextResponse.json(
            { error: 'Logs channel not found' },
            { status: 404 }
        )

    await db.delete(employees).where(eq(employees.id, employeeId))
    await db.delete(orders).where(eq(orders.employeeId, employeeId))

    await sendLogsMessage(
        logsHook.url,
        '**Funcionário removido**',
        `Funcionário(a) \`${lastUpdateEmployee.name} - ${lastUpdateEmployee.role}\` foi removido do sistema por \`${user.employee}\``
    )

    return NextResponse.json({ deleted: true }, { status: 200 })
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = EmployeeSchema.safeParse(data)

    if (parsedBody.success && parsedBody.data.id) {
        const lastUpdateEmployees = await db
            .select({
                status: employees.status,
                name: employees.name,
                role: employeeRoles.name,
                store: employees.storeId
            })
            .from(employees)
            .where(eq(employees.id, parsedBody.data.id))
            .innerJoin(
                employeeRoles,
                eq(employeeRoles.id, employees.employeeRoleId)
            )
        const lastUpdateEmployee = lastUpdateEmployees.at(0)

        if (lastUpdateEmployee) {
            const userRegisters = await db
                .select({
                    employee: employees.name
                })
                .from(employees)
                .where(eq(employees.userId, session.user.id))

            const hooksRegistred = await db
                .select({
                    url: discordWebhooks.url
                })
                .from(discordWebhooks)
                .where(
                    and(
                        eq(discordWebhooks.storeId, lastUpdateEmployee.store),
                        eq(discordWebhooks.category, 'LOGS')
                    )
                )

            const roleToUpdate = await db
                .select({ name: employeeRoles.name })
                .from(employeeRoles)
                .where(eq(employeeRoles.id, parsedBody.data.role))

            const role = roleToUpdate.at(0)
            const logsHook = hooksRegistred.at(0)
            const user = userRegisters.at(0)

            if (logsHook && user && role) {
                await sendLogsMessage(
                    logsHook.url,
                    '**Funcionário atualizado**',
                    `Funcionário(a) \`${lastUpdateEmployee.name} - ${
                        lastUpdateEmployee.role
                    } (${
                        lastUpdateEmployee.status === 'ACTIVE'
                            ? 'Ativo'
                            : 'Desativado'
                    })\` foi alterado para \`${parsedBody.data.name} - ${
                        role.name
                    } (${
                        parsedBody.data.status === 'ACTIVE'
                            ? 'Ativo'
                            : 'Desativado'
                    })\` por \`${user.employee}\``
                )
            }
        }

        await db
            .update(employees)
            .set({
                name: parsedBody.data.name,
                status: parsedBody.data.status,
                employeeRoleId: parsedBody.data.role
            })
            .where(eq(employees.id, parsedBody.data.id))

        return NextResponse.json({ success: true }, { status: 200 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
