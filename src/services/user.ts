import { db } from '@/providers/database/client'
import { accounts, users } from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'

export async function getUserAccount(userId: string) {
    const accountsRegisters = await db
        .select({
            discordToken: accounts.access_token,
            userRole: users.role,
            userId: users.id
        })
        .from(users)
        .where(eq(users.id, userId))
        .innerJoin(
            accounts,
            and(eq(users.id, accounts.userId), eq(accounts.provider, 'discord'))
        )
        .limit(1)

    const account = accountsRegisters.at(0)

    if (!account || !account.discordToken)
        throw new Error('User not authenticated')

    return account
}
