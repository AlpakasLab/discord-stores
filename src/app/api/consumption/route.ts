import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/core/auth'
import { OrderItem } from '@/entities/order'
import { db } from '@/providers/database/client'
import {
    discordWebhooks,
    employeeRoles,
    employees,
    webhooksTemplates
} from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'
import { sendConsumptionMessage } from '@/services/consumption'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = (await request.json()) as {
        items: OrderItem[]
        storeId: string
    }

    const userRegisters = await db
        .select({
            employee: employees.name
        })
        .from(employees)
        .where(eq(employees.userId, session.user.id))
        .innerJoin(
            employeeRoles,
            eq(employeeRoles.id, employees.employeeRoleId)
        )
    const user = userRegisters.at(0)

    if (!user) {
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )
    }

    const hooksRegistred = await db
        .select({
            url: discordWebhooks.url,
            template: webhooksTemplates
        })
        .from(discordWebhooks)
        .where(
            and(
                eq(discordWebhooks.storeId, data.storeId),
                eq(discordWebhooks.category, 'CONSUM')
            )
        )
        .innerJoin(
            webhooksTemplates,
            eq(webhooksTemplates.id, discordWebhooks.webhooksTemplateId)
        )

    const consumptionHook = hooksRegistred.at(0)

    if (!consumptionHook) {
        return NextResponse.json(
            { error: 'Cannot get discord webhooks' },
            { status: 400 }
        )
    }

    const items = data.items as OrderItem[]

    let productsList = ''
    items.forEach(item => {
        productsList += `${item.quantity}x ${item.name}\n`
    })

    const result = await sendConsumptionMessage(
        consumptionHook.url,
        consumptionHook.template,
        {
            'employee-name': user.employee,
            items: productsList
        }
    )

    if (!result)
        return NextResponse.json(
            { error: 'Cannot send a new request' },
            { status: 400 }
        )

    return NextResponse.json({ success: true }, { status: 201 })
}
