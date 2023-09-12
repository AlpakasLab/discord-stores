import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import {
    accounts,
    discordWebhooks,
    employees
} from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'
import { EmployeeSchema } from '@/entities/employee'
import { sendLogsMessage } from '@/services/logs'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.email ||
        !session.user.role ||
        session.user.role !== 'ADMIN'
    )
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = EmployeeSchema.safeParse(data)

    if (parsedBody.success && parsedBody.data.id) {
        const lastUpdateEmployees = await db
            .select({ status: employees.status, store: employees.storeId })
            .from(employees)
            .where(eq(employees.id, parsedBody.data.id))
        const lastUpdateEmployee = lastUpdateEmployees.at(0)

        if (lastUpdateEmployee) {
            const userRegisters = await db
                .select({
                    employee: employees.name
                })
                .from(accounts)
                .where(eq(accounts.access_token, session.user.discord))
                .innerJoin(employees, eq(employees.userId, accounts.userId))

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
            const user = userRegisters.at(0)

            if (logsHook && user) {
                await sendLogsMessage(
                    logsHook.url,
                    '**Funcionário atualizado**',
                    `Funcionário(a) \`${parsedBody.data.name}\` foi ${
                        parsedBody.data.status === 'ACTIVE'
                            ? 'ativado'
                            : 'bloqueado'
                    } por \`${user.employee}\``
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
