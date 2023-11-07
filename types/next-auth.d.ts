import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id?: string
            role?: 'SELLER' | 'ADMIN' | 'MASTER'
            accessToken?: string
        } & DefaultSession['user']
        error?: 'RefreshAccessTokenError'
    }
}
