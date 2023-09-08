import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { employees } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'
import { EmployeeSchema } from '@/entities/employee'

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
    const parsedBody = EmployeeSchema.safeParse(data)

    if (parsedBody.success && parsedBody.data.id) {
        await db
            .update(employees)
            .set({
                name: parsedBody.data.name,
                status: parsedBody.data.status,
                employeeRoleId: parsedBody.data.role
            })
            .where(eq(employees.id, parsedBody.data.id))

        return NextResponse.json({ success: true }, { status: 200 })
    } else {
        return NextResponse.json({ error: 'Invalidy data' }, { status: 400 })
    }
}
