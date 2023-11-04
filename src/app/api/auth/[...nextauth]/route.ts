import NextAuth, { NextAuthOptions, TokenSet } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/providers/database/client'
import { getUserAccount, updateUseDiscordToken } from '@/services/user'
import moment from 'moment'

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

            try {
                if (
                    account &&
                    account.discordToken &&
                    account.tokenExpiresAt &&
                    account.refreshToken &&
                    moment().isAfter(moment.unix(account.tokenExpiresAt))
                ) {
                    const response = await fetch(
                        `${process.env.DISCORD_API_URL}/oauth2/token`,
                        {
                            method: 'POST',
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
                    )

                    const responseData = (await response.json()) as TokenSet

                    if (
                        responseData.access_token !== undefined &&
                        responseData.refresh_token !== undefined &&
                        responseData.scope !== undefined
                    ) {
                        await updateUseDiscordToken(
                            account.userId,
                            Number(responseData.expires_in),
                            responseData.access_token,
                            responseData.refresh_token,
                            responseData.scope
                        )

                        return {
                            ...session,
                            user: {
                                ...session.user,
                                id: account.userId,
                                role: account.userRole,
                                accessToken: responseData.access_token
                            }
                        }
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
            } catch (error) {
                return {
                    ...session,
                    error: 'RefreshAccessTokenError' as const,
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
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
