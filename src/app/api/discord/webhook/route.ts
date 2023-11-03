import { db } from '@/providers/database/client'
import { discordWebhooks, webhooksTemplates } from '@/providers/database/schema'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import { WebHookSchema } from '@/entities/webhook'
import { and, eq } from 'drizzle-orm'
import crypto from 'node:crypto'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN')
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = WebHookSchema.safeParse(data)

    if (parsedBody.success) {
        try {
            const { storeId, logs, sell, consumption, stock } = parsedBody.data

            const webhooksAlias = {
                SELL: sell,
                LOGS: logs,
                CONSUM: consumption,
                STOCK: stock
            }

            const discordWebhooksRegisters = await db
                .select({
                    id: discordWebhooks.id,
                    category: discordWebhooks.category
                })
                .from(discordWebhooks)
                .where(and(eq(discordWebhooks.storeId, storeId)))

            const promisses: Promise<unknown>[] = []

            Object.entries(webhooksAlias).forEach(([key, value]) => {
                if (value === undefined) return

                const logsRegistered = discordWebhooksRegisters.find(
                    item => item.category === key
                )

                if (logsRegistered !== undefined) {
                    return promisses.push(
                        db
                            .update(discordWebhooks)
                            .set({
                                url: logs
                            })
                            .where(eq(discordWebhooks.id, logsRegistered.id))
                    )
                } else {
                    return promisses.push(
                        new Promise(async resolve => {
                            const webhookTempleateId = crypto.randomUUID()
                            const discordWebhookId = crypto.randomUUID()

                            await db.insert(webhooksTemplates).values({
                                id: webhookTempleateId
                            })

                            await db.insert(discordWebhooks).values({
                                id: discordWebhookId,
                                storeId: storeId,
                                category: key as
                                    | 'SELL'
                                    | 'LOGS'
                                    | 'CONSUM'
                                    | 'STOCK',
                                url: value,
                                webhooksTemplateId: webhookTempleateId
                            })

                            return resolve(true)
                        })
                    )
                }
            })

            await Promise.all(promisses)

            return NextResponse.json({ success: true }, { status: 201 })
        } catch (e) {
            return NextResponse.json(
                { error: 'Cannot save discord webhook' },
                { status: 400 }
            )
        }
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
