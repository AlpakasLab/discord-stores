import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { db } from '@/providers/database/client'
import { employeeRoles, employees } from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const storeId = requestUrl.searchParams.get('store')

    if (!storeId)
        return NextResponse.json(
            { error: 'Store id is not provided' },
            { status: 400 }
        )

    const session = await getServerSession(authOptions)
    if (!session || !session.user.id)
        return NextResponse.json(
            { error: 'User not authenticated or not authorized' },
            { status: 401 }
        )

    const userRegisters = await db
        .select({
            manager: employeeRoles.manager
        })
        .from(employees)
        .where(
            and(
                eq(employees.userId, session.user.id),
                eq(employees.storeId, storeId)
            )
        )
        .innerJoin(
            employeeRoles,
            eq(employeeRoles.id, employees.employeeRoleId)
        )

    const user = userRegisters.at(0)

    if (!user)
        return NextResponse.json(
            { error: 'Employee not found' },
            { status: 404 }
        )

    return NextResponse.json(
        { manager: user.manager === true },
        { status: 200 }
    )
}
