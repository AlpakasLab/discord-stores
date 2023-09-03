import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { db } from '@/providers/database/client'
import { inArray } from 'drizzle-orm'
import { stores } from '@/providers/database/schema'
import { getUserAccount } from './user'

export async function getUserStores() {
    const { discordToken, role } = await getUserAccount()
    if (!discordToken) throw new Error('User not authenticated')

    const rest = new REST({ version: '10', authPrefix: 'Bearer' }).setToken(
        discordToken
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
                server: stores.serverId
            })
            .from(stores)
            .where(inArray(stores.serverId, serversIds))

        return guilds.map(guild => {
            const storeData = storesRegistred.find(
                item => item.server === guild.id
            )

            const haveAdministratorPermission =
                (Number(guild.permissions) & 0x8) === 8
            const userAreAdmin = role === 'ADMIN'

            return {
                id: storeData ? storeData.id : guild.id,
                name: storeData ? storeData.name : guild.name,
                active: false,
                administrator: haveAdministratorPermission && userAreAdmin
            }
        })
    } catch (error) {
        throw new Error('Cannot get user guilds')
    }
}
