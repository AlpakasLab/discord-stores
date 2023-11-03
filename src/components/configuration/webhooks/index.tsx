'use client'

import { useRouter } from 'next/navigation'
import Button from '../../inputs/button'
import TextInput from '../../inputs/text'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { InsertWebHookData, WebHookSchema } from '@/entities/webhook'
import { useStoreContext } from '@/components/store/context'
import toast from 'react-hot-toast'

type WebHooksFormProps = {
    webhooks: {
        id: string
        url: string
        category: 'SELL' | 'LOGS' | 'CONSUM' | 'STOCK'
    }[]
    store: string
}

export default function WebHooksForm({ webhooks, store }: WebHooksFormProps) {
    const { themed } = useStoreContext()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting, defaultValues }
    } = useForm<InsertWebHookData>({
        resolver: zodResolver(WebHookSchema),
        defaultValues: {
            storeId: store,
            sell: webhooks.find(webhook => webhook.category === 'SELL')?.url,
            logs: webhooks.find(webhook => webhook.category === 'LOGS')?.url,
            consumption: webhooks.find(webhook => webhook.category === 'CONSUM')
                ?.url,
            stock: webhooks.find(webhook => webhook.category === 'STOCK')?.url
        }
    })

    const [creating, setCreating] = useState(false)

    const saveWebhook = async (data: InsertWebHookData) => {
        setCreating(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/discord/webhook`,
                {
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            )

            if (!response.ok) {
                setCreating(false)
                toast.error('Não foi possível salvar os webhooks :(')
            } else {
                reset()
                setCreating(false)
                router.refresh()
            }
        } catch (e) {
            toast.error('Não foi possível salvar os webhooks :(')
        }
    }

    useEffect(() => {
        const sell = webhooks.find(webhook => webhook.category === 'SELL')
        const logs = webhooks.find(webhook => webhook.category === 'LOGS')
        const consumption = webhooks.find(
            webhook => webhook.category === 'CONSUM'
        )
        const stock = webhooks.find(webhook => webhook.category === 'STOCK')

        if (sell !== defaultValues?.sell) {
            setValue('sell', sell?.url)
        }

        if (logs !== defaultValues?.logs) {
            setValue('logs', logs?.url)
        }

        if (consumption !== defaultValues?.consumption) {
            setValue('consumption', consumption?.url)
        }

        if (stock !== defaultValues?.stock) {
            setValue('stock', stock?.url)
        }
    }, [defaultValues, setValue, webhooks])

    return (
        <form
            onSubmit={handleSubmit(saveWebhook)}
            className="grid w-full grid-cols-3 gap-5"
        >
            <div className="flex flex-col gap-y-2">
                <TextInput
                    {...register('sell')}
                    label="Webhook de Vendas:"
                    type="url"
                    autoComplete="none"
                    error={errors.sell?.message}
                    placeholder="https://discord.com/api/webhooks/..."
                />
                <p className="text-sm text-zinc-500">
                    Toda venda realizada na aba &quot;Produtos&quot; será
                    enviada para este webhook; Com a mensagem personalizada em
                    &quot;Customizações&quot;.
                </p>
            </div>
            <div className="flex flex-col gap-y-2">
                <TextInput
                    {...register('logs')}
                    label="Webhook de Registros do Sistema:"
                    type="url"
                    autoComplete="none"
                    error={errors.logs?.message}
                    placeholder="https://discord.com/api/webhooks/..."
                />
                <p className="text-sm text-zinc-500">
                    Toda ação dentro do site, como por exemplo: mudanças de
                    cargo, entrada de funcionários, etc. Será informada por este
                    webhook.
                </p>
            </div>
            <div className="flex flex-col gap-y-2">
                <TextInput
                    {...register('consumption')}
                    label="Webhook de Consumo:"
                    type="url"
                    autoComplete="none"
                    error={errors.consumption?.message}
                    placeholder="https://discord.com/api/webhooks/..."
                />
                <p className="text-sm text-zinc-500">
                    Todo consumo registro na aba &quot;Consumo&quot; será
                    enviada para este webhook; Com a mensagem personalizada em
                    &quot;Customizações&quot;.
                </p>
            </div>
            <div className="flex flex-col gap-y-2">
                <TextInput
                    {...register('stock')}
                    label="Webhook de Estoque:"
                    type="url"
                    autoComplete="none"
                    error={errors.stock?.message}
                    placeholder="https://discord.com/api/webhooks/..."
                />
                <p className="text-sm text-zinc-500">
                    Todo registro de entrada ou retirada de items na aba
                    &quot;Estoque&quot; será enviada para este webhook; Com a
                    mensagem personalizada em &quot;Customizações&quot;.
                </p>
            </div>
            <div className="col-span-full">
                <Button
                    disabled={isSubmitting || creating}
                    component="button"
                    type="submit"
                    color={themed ? 'custom-primary' : 'primary'}
                    size="sm"
                    text={creating ? 'Salvando' : 'Salvar'}
                />
            </div>
        </form>
    )
}
