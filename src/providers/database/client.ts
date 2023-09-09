import * as schema from './schema'
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'

const connection = connect({
    url: process.env.URL_DATABASE
})

const db = drizzle(connection, { schema })

export { db }
