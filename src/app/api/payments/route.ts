import { db } from '@/providers/database/client'
import { discordWebhooks, payments, stores } from '@/providers/database/schema'
import { sendLogsMessage } from '@/services/logs'
import { and, asc, desc, eq } from 'drizzle-orm'
import moment from 'moment'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    if (
        req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return Response.json({ error: 'Unathorized' }, { status: 401 })
    }

    const today = moment()

    const storesRegisters = await db
        .select({
            id: stores.id,
            name: stores.name,
            owner: stores.ownerId,
            active: stores.active,
            logsWebhook: discordWebhooks.url
        })
        .from(stores)
        .where(eq(stores.active, true))
        .leftJoin(
            discordWebhooks,
            and(
                eq(discordWebhooks.storeId, stores.id),
                eq(discordWebhooks.category, 'LOGS')
            )
        )

    const promisses: Promise<any>[] = []

    storesRegisters.forEach(store => {
        if (store.logsWebhook === null) return

        return promisses.push(
            new Promise(async (resolve, rejects) => {
                const lastPayments = await db
                    .select({ createdAt: payments.createdAt })
                    .from(payments)
                    .where(eq(payments.storeId, store.id))
                    .orderBy(desc(payments.createdAt))
                    .limit(1)

                const lastPayment = lastPayments.at(0)

                const paymentPending =
                    lastPayment !== undefined
                        ? moment(lastPayment.createdAt)
                              .add(30, 'days')
                              .isBefore(today)
                        : true

                if (lastPayment === undefined || paymentPending) {
                    const webhookMessage = await sendLogsMessage(
                        store.logsWebhook ?? '',
                        '**Pagamento Pendente**',
                        'O pagamento mensal do site ainda não foi realizado, por favor realize o pagamento antes que o sistema seja desativado!'
                    )

                    if (webhookMessage === false) return rejects()
                    return resolve(webhookMessage)
                }

                return resolve(true)
            })
        )
    })

    return Promise.all(promisses)
        .then(() => {
            return NextResponse.json({ ok: true })
        })
        .catch(() => {
            return NextResponse.json(
                { error: 'Something going wrong' },
                { status: 500 }
            )
        })
}
