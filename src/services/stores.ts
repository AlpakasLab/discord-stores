import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { db } from '@/providers/database/client'
import { eq, inArray } from 'drizzle-orm'
import { stores } from '@/providers/database/schema'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getUserStores() {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    const rest = new REST({ version: '10', authPrefix: 'Bearer' }).setToken(
        session.user.discord
    )

    try {
        const guilds = (await rest.get(Routes.userGuilds())) as {
            id: string
            name: string
            permissions: string
        }[]

        const serversIds = guilds.map(guild => guild.id)

        const storesRegistred = await db
            .select({
                name: stores.name,
                id: stores.id,
                server: stores.serverId,
                active: stores.active
            })
            .from(stores)
            .where(inArray(stores.serverId, serversIds))

        const userAreAdmin = session.user.role === 'ADMIN'

        if (userAreAdmin) {
            return guilds.map(guild => {
                const storeData = storesRegistred.find(
                    item => item.server === guild.id
                )

                const haveAdministratorPermission =
                    (Number(guild.permissions) & 0x8) === 8

                return {
                    id: storeData ? storeData.id : guild.id,
                    name: storeData ? storeData.name : guild.name,
                    active:
                        storeData !== undefined && storeData.active === true,
                    administrator: haveAdministratorPermission && userAreAdmin
                }
            })
        } else {
            return storesRegistred.map(store => {
                return {
                    id: store.id,
                    name: store.name,
                    active: store.active === true,
                    administrator: false
                }
            })
        }
    } catch (error) {
        throw new Error('Cannot get user guilds')
    }
}

export async function getStoreName(id: string) {
    try {
        const storesRegistred = await db
            .select({
                name: stores.name
            })
            .from(stores)
            .where(eq(stores.id, id))

        const store = storesRegistred.at(0)

        if (store) {
            return store.name
        } else {
            throw new Error('Cannot get store name')
        }
    } catch (error) {
        throw new Error('Cannot get store name')
    }
}
