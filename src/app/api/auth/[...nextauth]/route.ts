import NextAuth, { NextAuthOptions, TokenSet } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/providers/database/client'
import { getUserAccount, updateUseDiscordToken } from '@/services/user'
import moment from 'moment'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization:
                'https://discord.com/api/oauth2/authorize?scope=identify+email+guilds'
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

            if (
                account &&
                account.discordToken &&
                account.tokenExpiresAt &&
                account.refreshToken &&
                moment().isAfter(moment.unix(account.tokenExpiresAt))
            ) {
                try {
                    const rest = new REST({
                        version: '10'
                    }).setToken(account.discordToken)

                    const response = (await rest.post(
                        Routes.oauth2TokenExchange(),
                        {
                            headers: {
                                'Content-Type':
                                    'application/x-www-form-urlencoded'
                            },
                            body: new URLSearchParams({
                                client_id: process.env.DISCORD_CLIENT_ID,
                                client_secret:
                                    process.env.DISCORD_CLIENT_SECRET,
                                grant_type: 'refresh_token',
                                refresh_token: account.refreshToken
                            })
                        }
                    )) as TokenSet

                    if (
                        response.access_token !== undefined &&
                        response.refresh_token !== undefined &&
                        response.scope !== undefined
                    ) {
                        await updateUseDiscordToken(
                            account.userId,
                            Number(response.expires_in),
                            response.access_token,
                            response.refresh_token,
                            response.scope
                        )

                        return {
                            ...session,
                            user: {
                                ...session.user,
                                id: account.userId,
                                role: account.userRole,
                                accessToken: response.access_token
                            }
                        }
                    } else {
                        return {
                            ...session,
                            user: {
                                ...session.user,
                                id: account.userId,
                                role: account.userRole,
                                accessToken: account.discordToken
                            }
                        }
                    }
                } catch (error) {
                    session.error = 'RefreshAccessTokenError' as const
                }
            }

            return {
                ...session,
                user: {
                    ...session.user,
                    id: account.userId,
                    role: account.userRole,
                    accessToken: account.discordToken
                }
            }
        }
    }
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
