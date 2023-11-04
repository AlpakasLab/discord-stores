import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import {
    discordWebhooks,
    employees,
    webhooksTemplates
} from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'
import { StockItem, StockSaveSchema } from '@/entities/item'
import { sendStockMessage } from '@/services/stock'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = StockSaveSchema.safeParse(data)

    if (parsedBody.success) {
        const userRegisters = await db
            .select({
                employee: employees.name,
                employeeId: employees.id,
                store: employees.storeId
            })
            .from(employees)
            .where(
                and(
                    eq(employees.userId, session.user.id),
                    eq(employees.storeId, parsedBody.data.store)
                )
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
                    eq(discordWebhooks.category, 'STOCK')
                )
            )
            .innerJoin(
                webhooksTemplates,
                eq(webhooksTemplates.id, discordWebhooks.webhooksTemplateId)
            )

        const stockHook = hooksRegistred.at(0)

        if (!stockHook) {
            return NextResponse.json(
                { error: 'Cannot get discord webhooks' },
                { status: 400 }
            )
        }

        const items = data.items as StockItem[]

        let productsList = ''
        let addedProductsList = ''
        let removedProductsList = ''

        items.forEach(item => {
            productsList += `${
                item.quantity < 0 ? item.quantity : `+${item.quantity}`
            } ${item.name}\n`

            if (item.quantity < 0) {
                removedProductsList += `${item.quantity * -1} ${item.name}\n`
            } else {
                addedProductsList += `${item.quantity} ${item.name}\n`
            }
        })

        const result = await sendStockMessage(
            stockHook.url,
            stockHook.template,
            {
                'employee-name': user.employee,
                items: productsList,
                'items-add': addedProductsList,
                'items-remove': removedProductsList
            }
        )

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
