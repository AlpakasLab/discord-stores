import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id?: string
            role?: 'SELLER' | 'ADMIN'
            accessToken?: string
        } & DefaultSession['user']
        error?: 'RefreshAccessTokenError'
    }
}
