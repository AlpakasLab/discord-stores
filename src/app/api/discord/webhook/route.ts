import { db } from '@/providers/database/client'
import { discordWebhooks } from '@/providers/database/schema'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { authOptions } from '../../auth/[...nextauth]/route'
import { InsertWebHookSchema } from '@/entities/webhook'
import { and, eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
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
    const parsedBody = InsertWebHookSchema.safeParse(data)

    if (parsedBody.success) {
        try {
            const { storeId, logs, sell } = parsedBody.data

            const discordWebhooksRegisters = await db
                .select({
                    id: discordWebhooks.id,
                    category: discordWebhooks.category
                })
                .from(discordWebhooks)
                .where(and(eq(discordWebhooks.storeId, storeId)))

            const logsRegistered = discordWebhooksRegisters.find(
                item => item.category === 'LOGS'
            )
            const sellsRegistered = discordWebhooksRegisters.find(
                item => item.category === 'SELL'
            )

            if (logsRegistered !== undefined && logs) {
                await db
                    .update(discordWebhooks)
                    .set({
                        url: logs
                    })
                    .where(eq(discordWebhooks.id, logsRegistered.id))
            } else if (logs) {
                await db.insert(discordWebhooks).values({
                    id: crypto.randomUUID(),
                    storeId: storeId,
                    category: 'LOGS',
                    url: logs
                })
            }

            if (sellsRegistered !== undefined && sell) {
                await db
                    .update(discordWebhooks)
                    .set({
                        url: sell
                    })
                    .where(eq(discordWebhooks.id, sellsRegistered.id))
            } else if (sell) {
                await db.insert(discordWebhooks).values({
                    id: crypto.randomUUID(),
                    storeId: storeId,
                    category: 'SELL',
                    url: sell
                })
            }

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
