import { db } from '@/providers/database/client'
import { discordWebhooks, webhooksTemplates } from '@/providers/database/schema'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { authOptions } from '../../auth/[...nextauth]/route'
import { and, eq } from 'drizzle-orm'
import { ConsumptionWebHookSchema } from '@/entities/webhook'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN')
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = ConsumptionWebHookSchema.safeParse(data)

    if (parsedBody.success) {
        try {
            const { storeId, consumption } = parsedBody.data

            const discordWebhooksRegisters = await db
                .select({
                    id: discordWebhooks.id,
                    category: discordWebhooks.category
                })
                .from(discordWebhooks)
                .where(and(eq(discordWebhooks.storeId, storeId)))

            const consumptionRegistered = discordWebhooksRegisters.find(
                item => item.category === 'CONSUM'
            )

            if (consumptionRegistered !== undefined && consumption) {
                await db
                    .update(discordWebhooks)
                    .set({
                        url: consumption
                    })
                    .where(eq(discordWebhooks.id, consumptionRegistered.id))
            } else if (consumption) {
                const webhookTempleateId = crypto.randomUUID()

                await db.insert(webhooksTemplates).values({
                    id: webhookTempleateId
                })

                await db.insert(discordWebhooks).values({
                    id: crypto.randomUUID(),
                    storeId: storeId,
                    category: 'CONSUM',
                    url: consumption,
                    webhooksTemplateId: webhookTempleateId
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
