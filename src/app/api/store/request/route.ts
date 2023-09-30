import { RequestEntrySchema } from '@/entities/store'
import { db } from '@/providers/database/client'
import { discordWebhooks, employees } from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { authOptions } from '../../auth/[...nextauth]/route'
import { sendLogsMessage } from '@/services/logs'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = RequestEntrySchema.safeParse(data)

    if (parsedBody.success) {
        const hooksRegistred = await db
            .select({
                url: discordWebhooks.url
            })
            .from(discordWebhooks)
            .where(
                and(
                    eq(discordWebhooks.storeId, parsedBody.data.server),
                    eq(discordWebhooks.category, 'LOGS')
                )
            )

        const logsHook = hooksRegistred.at(0)

        await db.insert(employees).values({
            id: crypto.randomUUID(),
            name: parsedBody.data.name,
            status: 'PENDING',
            storeId: parsedBody.data.server,
            userId: session.user.id
        })

        if (logsHook) {
            await sendLogsMessage(
                logsHook.url,
                '**Solicitação de entrada**',
                `\`${session.user.name}\` solicitou a entrada como funcionário(a) \`${parsedBody.data.name}\``
            )
        }

        return NextResponse.json({ success: true }, { status: 201 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
