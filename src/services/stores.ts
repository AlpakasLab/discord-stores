import { db } from '@/providers/database/client'
import { and, eq, inArray } from 'drizzle-orm'
import { employees, stores } from '@/providers/database/schema'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getUserStores() {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.accessToken ||
        !session.user.id
    )
        throw new Error('User not authenticated')

    try {
        const storesRegistred = await db
            .select({
                name: stores.name,
                id: stores.id,
                server: stores.serverId,
                active: stores.active,
                employee: employees.status
            })
            .from(stores)
            .leftJoin(
                employees,
                and(
                    eq(employees.storeId, stores.id),
                    eq(employees.userId, session.user.id)
                )
            )

        const userAreAdmin =
            session.user.role === 'ADMIN' || session.user.role === 'MASTER'

        return storesRegistred
            .filter(store => store.employee !== null)
            .map(store => {
                return {
                    id: store.id,
                    name: store.name,
                    active:
                        store.employee === 'DISABLED'
                            ? false
                            : store.active === true,
                    administrator: userAreAdmin,
                    employee: store.employee
                }
            })
    } catch (error) {
        throw new Error('Cannot get user guilds')
    }
}

export async function getStoreData(id: string) {
    try {
        const storesRegistred = await db
            .select({
                name: stores.name,
                primaryColor: stores.primaryColor,
                secondaryColor: stores.secondaryColor
            })
            .from(stores)
            .where(eq(stores.id, id))

        const store = storesRegistred.at(0)

        if (store) {
            return store
        } else {
            throw new Error('Cannot get store name')
        }
    } catch (error) {
        throw new Error('Cannot get store name')
    }
}
