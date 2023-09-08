import { z } from 'zod'

const envVariables = z.object({
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    DISCORD_API_URL: z.string(),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    URL_DATABASE: z.string(),
    NEXT_PUBLIC_LOCAL_API_URL: z.string().url()
})

const env = envVariables.parse(process.env)

export { env }

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envVariables> {}
    }
}
