import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { employeeRoles } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'

export async function getEmployeeRoles(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    try {
        const rolesRegistred = await db
            .select({
                name: employeeRoles.name,
                comission: employeeRoles.comission,
                manager: employeeRoles.manager,
                id: employeeRoles.id,
                store: employeeRoles.storeId
            })
            .from(employeeRoles)
            .where(eq(employeeRoles.storeId, store))

        return rolesRegistred
    } catch (error) {
        throw new Error('Cannot get roles')
    }
}
