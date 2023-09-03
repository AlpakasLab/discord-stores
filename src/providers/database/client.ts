import * as schema from './schema'
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'
import { env } from '@/core/enviroment'

const connection = connect({
    url: env.URL_DATABASE
})

const db = drizzle(connection, { schema })

export { db }
