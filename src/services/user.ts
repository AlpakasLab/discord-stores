import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { accounts, users } from '@/providers/database/schema'
import { and, eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'

export async function getUserAccount() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email)
        throw new Error('User not authenticated')

    const accountsRegisters = await db
        .select({
            discordToken: accounts.access_token,
            role: users.role
        })
        .from(users)
        .where(eq(users.email, session.user.email))
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
