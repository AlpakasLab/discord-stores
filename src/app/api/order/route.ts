import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { OrderCreateSchema } from '@/entities/order'
import { db } from '@/providers/database/client'
import {
    accounts,
    discordWebhooks,
    employees
} from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'
import { sendOrderMessage } from '@/providers/discord/webhooks'
import { numberToMoney } from '@/utils/formatter'

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
            .select({ id: accounts.userId, employee: employees.name })
            .from(accounts)
            .where(eq(accounts.access_token, session.user.discord))
            .innerJoin(employees, eq(employees.userId, accounts.userId))
        const user = userRegisters.at(0)

        if (!user) {
            return NextResponse.json(
                { error: 'User not authenticated or not authorized' },
                { status: 401 }
            )
        }

        const hooksRegistred = await db
            .select({
                url: discordWebhooks.url
            })
            .from(discordWebhooks)
            .where(
                and(
                    eq(discordWebhooks.storeId, parsedBody.data.store),
                    eq(discordWebhooks.category, 'SELL')
                )
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
            discountTotal = numberToMoney(total - discountValue)
        }

        const result = sendOrderMessage(
            sellHook.url,
            user.employee,
            parsedBody.data.client,
            productsList,
            numberToMoney(total),
            parsedBody.data.discount,
            discountTotal
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
