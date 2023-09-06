import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { employeeRoles } from '@/providers/database/schema'
import { EmployeeRoleSchema } from '@/entities/employeeRole'
import { eq } from 'drizzle-orm'

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
    const parsedBody = EmployeeRoleSchema.safeParse(data)

    if (parsedBody.success) {
        await db.insert(employeeRoles).values({
            id: crypto.randomUUID(),
            name: parsedBody.data.name,
            comission: parsedBody.data.comission,
            storeId: parsedBody.data.store,
            manager: parsedBody.data.manager
        })

        return NextResponse.json({ success: true }, { status: 201 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}

export async function PUT(request: NextRequest) {
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
    const parsedBody = EmployeeRoleSchema.safeParse(data)

    if (parsedBody.success && parsedBody.data.id) {
        await db
            .update(employeeRoles)
            .set({
                name: parsedBody.data.name,
                comission: parsedBody.data.comission,
                manager: parsedBody.data.manager
            })
            .where(eq(employeeRoles.id, parsedBody.data.id))

        return NextResponse.json({ success: true }, { status: 200 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
