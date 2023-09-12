import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { OrderCreateSchema } from '@/entities/order'
import { db } from '@/providers/database/client'
import crypto from 'node:crypto'
import {
    accounts,
    discordWebhooks,
    employeeRoles,
    employees,
    orders,
    webhooksTemplates
} from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'
import { numberToMoney } from '@/utils/formatter'
import { sendOrderMessage } from '@/services/order'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.email ||
        !session.user.role
    )
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = OrderCreateSchema.safeParse(data)

    if (parsedBody.success) {
        const userRegisters = await db
            .select({
                id: accounts.userId,
                employee: employees.name,
                comission: employeeRoles.comission
            })
            .from(accounts)
            .where(eq(accounts.access_token, session.user.discord))
            .innerJoin(employees, eq(employees.userId, accounts.userId))
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
                    eq(discordWebhooks.storeId, parsedBody.data.store),
                    eq(discordWebhooks.category, 'SELL')
                )
            )
            .innerJoin(
                webhooksTemplates,
                eq(webhooksTemplates.id, discordWebhooks.webhooksTemplateId)
            )

        const sellHook = hooksRegistred.at(0)

        if (!sellHook) {
            return NextResponse.json(
                { error: 'Cannot get discord webhooks' },
                { status: 400 }
            )
        }

        const items = data.items as {
            id: string
            name: string
            unitPrice: number
            quantity: number
        }[]

        let productsList = ''
        let total = 0

        items.forEach(item => {
            productsList += `${item.quantity}x ${item.name} - ${numberToMoney(
                item.unitPrice * item.quantity
            )}\n`

            total += item.unitPrice * item.quantity
        })

        let discountTotal = undefined

        if (parsedBody.data.discount) {
            const discountValue = (total / 100) * parsedBody.data.discount
            discountTotal = total - Math.round(discountValue)
        }

        let storeValue = 0
        let employeeValue = 0

        if (discountTotal) {
            storeValue = Math.floor(
                (discountTotal / 100) * (100 - user.comission)
            )
            employeeValue = Math.floor((discountTotal / 100) * user.comission)
        } else {
            storeValue = Math.floor((total / 100) * (100 - user.comission))
            employeeValue = Math.floor((total / 100) * user.comission)
        }

        await db.insert(orders).values({
            id: crypto.randomUUID(),
            clientName: parsedBody.data.client,
            employeeName: user.employee,
            comission: employeeValue,
            storeValue: storeValue,
            total: total,
            discount: parsedBody.data.discount,
            delivery: parsedBody.data.delivery,
            items: {
                values: items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                }))
            }
        })

        const result = await sendOrderMessage(sellHook.url, sellHook.template, {
            'client-name': parsedBody.data.client,
            'discount-percentage': parsedBody.data.discount
                ? `${parsedBody.data.discount}%`
                : undefined,
            'employee-name': user.employee,
            comission: numberToMoney(storeValue),
            items: productsList,
            total:
                parsedBody.data.discount && discountTotal
                    ? `~~${numberToMoney(total)}~~ -> ${numberToMoney(
                          discountTotal
                      )}`
                    : numberToMoney(total),
            delivery: parsedBody.data.delivery
                ? numberToMoney(parsedBody.data.delivery)
                : undefined
        })

        if (!result)
            return NextResponse.json(
                { error: 'Cannot send a new request' },
                { status: 400 }
            )

        return NextResponse.json({ success: true }, { status: 201 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
