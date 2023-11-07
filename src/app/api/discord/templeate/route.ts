import { TempleateWebHookSchema } from '@/entities/webhook'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { webhooksTemplates } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === 'SELLER')
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const data = await request.json()
    const parsedBody = TempleateWebHookSchema.safeParse(data)

    if (parsedBody.success && parsedBody.data.id) {
        await db
            .update(webhooksTemplates)
            .set({
                color: parsedBody.data.color
                    ? parseInt(parsedBody.data.color.replace('#', ''), 16)
                    : undefined,
                title: parsedBody.data.title,
                image: parsedBody.data.image,
                fields: {
                    values: parsedBody.data.fields
                }
            })
            .where(eq(webhooksTemplates.id, parsedBody.data.id))

        return NextResponse.json({ success: true }, { status: 200 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
