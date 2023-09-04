import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            role?: 'SELLER' | 'ADMIN'
            discord?: string
        } & DefaultSession['user']
    }
}
