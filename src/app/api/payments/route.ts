import { db } from '@/providers/database/client';
import { discordWebhooks, payments, stores } from '@/providers/database/schema';
import { sendLogsMessage } from '@/services/logs';
import { and, asc, eq } from 'drizzle-orm';
import moment from 'moment';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ error: 'Unathorized'}, { status: 401});
    }

    const today = moment()

    const storesAndPayments = await db.select({
        id: stores.id,
        name: stores.name,
        owner: stores.ownerId,
        active: stores.active,
        payments: payments,
        logsWebhook: discordWebhooks.url
    }).from(stores).leftJoin(payments, eq(payments.storeId, stores.id)).orderBy(asc(payments.createdAt)).leftJoin(discordWebhooks, and(
        eq(discordWebhooks.storeId, stores.id),
        eq(discordWebhooks.category, 'LOGS')
    ))

    const promisses: Promise<any>[] = []
    
    storesAndPayments.forEach(store => {
        if(store.logsWebhook === null) return 

        const paymentPending = moment(store.payments?.createdAt).add(30,'days').isBefore(today)

        if(store.payments === null || paymentPending){
            return promisses.push(new Promise(async (resolve, rejects)=>{
                const webhookMessage = await sendLogsMessage(
                    store.logsWebhook ?? '',
                    '**Pagamento Pendente**',
                    'O pagamento mensal do site ainda não foi realizado, por favor realize o pagamento antes que o sistema seja desativado!'
                )

                if(webhookMessage === false) return rejects()
                return resolve(webhookMessage)
            }))  
        }
    })

    return Promise.all(promisses).then(()=>{
        return NextResponse.json({ ok: true });
    }).catch(()=>{
        return NextResponse.json({ error: 'Something going wrong' }, { status: 500 });
    })
}