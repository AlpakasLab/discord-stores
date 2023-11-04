import {
    int,
    timestamp,
    mysqlTable,
    primaryKey,
    varchar,
    text,
    boolean,
    json
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
    active: boolean('active').default(true),
    primaryColor: varchar('primary_color', { length: 8 }),
    secondaryColor: varchar('secondary_color', { length: 8 })
})

export const products = mysqlTable('products', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    price: int('price').notNull(),
    image: varchar('image', { length: 255 }),
    categoryId: varchar('category_id', { length: 255 }).notNull(),
    active: boolean('active').default(true).notNull(),
    promotionalPrice: int('promotional_price'),
    employeeComission: int('employee_comission'),
    storeId: varchar('store_id', { length: 255 }).notNull()
})

export const productCategories = mysqlTable('product_categories', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    order: int('order').notNull().default(0),
    storeId: varchar('store_id', { length: 255 }).notNull()
})

export const tags = mysqlTable('tags', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull(),
    color: varchar('color', { length: 8 })
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

export const discordWebhooks = mysqlTable('discord_webhooks', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    url: varchar('url', { length: 255 }).notNull(),
    category: varchar('category', {
        length: 6,
        enum: ['SELL', 'LOGS', 'CONSUM', 'STOCK']
    }).notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull(),
    webhooksTemplateId: varchar('webhook_id', { length: 255 })
        .notNull()
        .unique()
})

export const employeeRoles = mysqlTable('employee_roles', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    comission: int('comission').notNull(),
    manager: boolean('manager').default(false).notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull()
})

export const employees = mysqlTable('employees', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    status: varchar('status', {
        length: 8,
        enum: ['ACTIVE', 'DISABLED', 'PENDING']
    }).notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    employeeRoleId: varchar('employee_role_id', { length: 255 })
})

export const webhooksTemplates = mysqlTable('webhooks_templates', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    title: varchar('title', { length: 255 }),
    color: int('color'),
    image: varchar('image', { length: 255 }),
    fields: json('fields').$type<{
        values: { title: string; value: string; inline?: boolean }[]
    }>()
})

export const orders = mysqlTable('orders', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    discordMessage: varchar('discord_message', { length: 255 }).notNull(),
    employeeName: varchar('employee_name', { length: 255 }).notNull(),
    clientName: varchar('client_name', { length: 255 }).notNull(),
    discount: int('discount'),
    total: int('total').notNull(),
    delivery: int('delivery'),
    comission: int('comission').notNull(),
    storeValue: int('store_value').notNull(),
    items: json('items')
        .$type<{
            values: { name: string; quantity: number; unitPrice: number }[]
        }>()
        .notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).defaultNow(),
    storeId: varchar('store_id', { length: 255 }).notNull(),
    employeeId: varchar('employee_id', { length: 255 })
})

export const deliveryValues = mysqlTable('delivery_values', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    description: varchar('description', { length: 255 }).notNull(),
    value: int('value').notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull()
})

export const notifications = mysqlTable('notifications', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    author: varchar('author', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 255 }).notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).defaultNow()
})

export const payments = mysqlTable('payments', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    value: int('value').notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).defaultNow()
})

export const items = mysqlTable('items', {
    id: varchar('id', { length: 255 }).notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    image: varchar('image', { length: 255 }),
    categoryId: varchar('category_id', { length: 255 }).notNull(),
    storeId: varchar('store_id', { length: 255 }).notNull()
})
