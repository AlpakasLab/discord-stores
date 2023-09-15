import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { db } from '@/providers/database/client'
import { accounts, employeeRoles, employees } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
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

    const userRegisters = await db
        .select({
            manager: employeeRoles.manager
        })
        .from(accounts)
        .where(eq(accounts.access_token, session.user.discord))
        .innerJoin(employees, eq(employees.userId, accounts.userId))
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
