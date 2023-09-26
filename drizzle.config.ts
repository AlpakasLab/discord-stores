import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
    schema: './src/providers/database/schema.ts',
    out: './drizzle',
    driver: 'mysql2',
    dbCredentials: {
        connectionString: process.env.URL_DATABASE
    }
} satisfies Config
