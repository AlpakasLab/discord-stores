import { env } from '@/core/enviroment'
import NextAuth, { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/providers/database/client'
import { getUserAccount } from '@/services/user'

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db),
    providers: [
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
            authorization:
                'https://discord.com/api/oauth2/authorize?scope=identify+email+guilds+guilds.members.read'
        })
    ],
    pages: {
        error: '/',
        signIn: '/',
        signOut: '/'
    },
    callbacks: {
        async session({ session, user }) {
            const account = await getUserAccount(user.id)
            return {
                ...session,
                user: {
                    ...session.user,
                    role: account.role,
                    discord: account.discordToken
                }
            }
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
