import 'dotenv/config'
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator'

const connection = connect({
    url: process.env.URL_DATABASE
})

const db = drizzle(connection)

const migrateTables = async () => {
    await migrate(db, { migrationsFolder: 'drizzle' })
}

migrateTables()
