import { db } from '@/providers/database/client'
import { accounts, users } from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'
import moment from 'moment'

export async function getUserAccount(userId: string) {
    const accountsRegisters = await db
        .select({
            userRole: users.role,
            userId: users.id,
            discordToken: accounts.access_token,
            tokenExpiresAt: accounts.expires_at,
            refreshToken: accounts.refresh_token
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

export async function updateUseDiscordToken(
    userId: string,
    expires: number,
    accessToken: string,
    refreshToken: string,
    scope: string
) {
    await db
        .update(accounts)
        .set({
            access_token: accessToken,
            expires_at: moment()
                .add({
                    seconds: expires
                })
                .unix(),
            refresh_token: refreshToken,
            scope: scope
        })
        .where(eq(users.id, userId))
}
