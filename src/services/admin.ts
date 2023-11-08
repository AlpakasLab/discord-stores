import { db } from '@/providers/database/client'
import { stores, users } from '@/providers/database/schema'
import { and, eq, isNotNull } from 'drizzle-orm'

export async function getAnalyticsData() {
    try {
        const storesRegistred = await db
            .select({
                name: stores.name,
                active: stores.active,
                primaryColor: stores.primaryColor,
                secondaryColor: stores.secondaryColor,
                owner: users.name
            })
            .from(stores)
            .leftJoin(users, eq(users.id, stores.ownerId))

        return {
            stores: storesRegistred
        }
    } catch (error) {
        throw new Error('Cannot get data')
    }
}

export async function getAdmins() {
    try {
        const adminsRegistereds = await db
            .select({
                id: users.id,
                name: users.name
            })
            .from(users)
            .where(and(eq(users.role, 'ADMIN'), isNotNull(users.name)))

        return adminsRegistereds as {
            id: string
            name: string
        }[]
    } catch (error) {
        throw new Error('Cannot get admins')
    }
}
