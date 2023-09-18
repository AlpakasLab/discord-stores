import { EmbedBuilder } from '@discordjs/builders'
import { SELL_TEMPLEATE_FIELDS } from '@/components/configuration/webhooks/templeates/sell'
import { sendMessageByWebhook } from '@/providers/discord/webhooks'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { employees, orders } from '@/providers/database/schema'
import { and, between, desc, eq, gte, lte } from 'drizzle-orm'
import moment from 'moment'

type SellFields = keyof typeof SELL_TEMPLEATE_FIELDS
type OrderData = Record<SellFields, string | undefined>

export const sendOrderMessage = async (
    webhookUrl: string,
    templeate: {
        id: string
        title: string | null
        color: number | null
        image: string | null
        fields: {
            values: {
                title: string
                value: string
                inline?: boolean | undefined
            }[]
        } | null
    },
    orderData: OrderData
) => {
    const embed = new EmbedBuilder()
        .setTitle(
            templeate.title && templeate.title.length > 0
                ? templeate.title
                : 'Registro de Venda'
        )
        .setColor(
            templeate.color && !isNaN(templeate.color)
                ? templeate.color
                : 0x52525b
        )

    if (templeate.image) {
        embed.setThumbnail(templeate.image)
    }

    if (templeate.fields) {
        templeate.fields.values.forEach(field => {
            const fieldValue = orderData[field.value as SellFields]

            if (fieldValue) {
                embed.addFields({
                    name: field.title,
                    value: fieldValue,
                    inline: field.inline
                })
            }
        })
    }

    const embedJson = embed.toJSON()
    const dataWebhook = {
        embeds: [embedJson]
    }

    return sendMessageByWebhook(webhookUrl, dataWebhook)
}

export async function getOrders(store: string, start?: string, end?: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

    const startDate = moment.utc(start).local(true).startOf('day').local(false)
    const endDate = moment.utc(end).local(true).endOf('day').local(false)

    try {
        const ordersRegisters = await db
            .select({
                id: orders.id,
                employeeName: orders.employeeName,
                employee: employees,
                client: orders.clientName,
                total: orders.total,
                employeeComission: orders.comission,
                storeComission: orders.storeValue,
                delivery: orders.delivery,
                discount: orders.discount,
                createdAt: orders.createdAt,
                items: orders.items
            })
            .from(orders)
            .where(
                and(
                    eq(orders.storeId, store),
                    between(
                        orders.createdAt,
                        startDate.toDate(),
                        endDate.toDate()
                    )
                )
            )
            .orderBy(desc(orders.createdAt))
            .leftJoin(employees, eq(employees.id, orders.employeeId))

        return {
            data: ordersRegisters,
            start: startDate.format('DD/MM'),
            end: endDate.format('DD/MM')
        }
    } catch (error) {
        throw new Error('Cannot get roles')
    }
}
