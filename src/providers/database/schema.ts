import {
    int,
    timestamp,
    mysqlTable,
    primaryKey,
    varchar,
    text,
    boolean
} from 'drizzle-orm/mysql-core'
import type { AdapterAccount } from 'next-auth/adapters'

export const users = mysqlTable('user', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerified: timestamp('emailVerified', {
        mode: 'date',
        fsp: 3
    }).defaultNow(),
    image: varchar('image', { length: 255 }),
    role: varchar('role', { length: 6, enum: ['SELLER', 'ADMIN'] })
        .default('SELLER')
        .notNull()
})

export const accounts = mysqlTable(
    'account',
    {
        userId: varchar('userId', { length: 255 }).notNull(),
        type: varchar('type', { length: 255 })
            .$type<AdapterAccount['type']>()
            .notNull(),
        provider: varchar('provider', { length: 255 }).notNull(),
        providerAccountId: varchar('providerAccountId', {
            length: 255
        }).notNull(),
        refresh_token: varchar('refresh_token', { length: 255 }),
        access_token: varchar('access_token', { length: 255 }),
        expires_at: int('expires_at'),
        token_type: varchar('token_type', { length: 255 }),
        scope: varchar('scope', { length: 255 }),
        id_token: varchar('id_token', { length: 255 }),
        session_state: varchar('session_state', { length: 255 })
    },
    account => ({
        compoundKey: primaryKey(account.provider, account.providerAccountId)
    })
)
export const sessions = mysqlTable('session', {
    userId: varchar('userId', { length: 255 }).notNull(),
    sessionToken: varchar('sessionToken', { length: 255 })
        .notNull()
        .primaryKey(),
    expires: timestamp('expires', { mode: 'date' }).notNull()
})

export const verificationTokens = mysqlTable(
    'verificationToken',
    {
        identifier: varchar('identifier', { length: 255 }).notNull(),
        token: varchar('token', { length: 255 }).notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull()
    },
    vt => ({
        compoundKey: primaryKey(vt.identifier, vt.token)
    })
)

export const stores = mysqlTable('stores', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    serverId: varchar('server_id', { length: 255 }).notNull().unique(),
    ownerId: varchar('owner_id', { length: 255 }).notNull(),
    active: boolean('active').default(true)
})

export const products = mysqlTable('products', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    price: int('price').notNull(),
    image: varchar('image', { length: 255 }),
    categoryId: varchar('category_id', { length: 255 }).notNull(),
    active: boolean('active').default(true).notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull()
})

export const productCategories = mysqlTable('product_categories', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull()
})

export const tags = mysqlTable('tags', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull()
})

export const productsToTags = mysqlTable(
    'products_to_tags',
    {
        productId: varchar('product_id', { length: 255 }).notNull(),
        tagId: varchar('tag_id', { length: 255 }).notNull()
    },
    table => ({
        compoundKey: primaryKey(table.productId, table.tagId)
    })
)
