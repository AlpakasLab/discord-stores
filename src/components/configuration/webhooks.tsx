'use client'

import { useRouter } from 'next/navigation'
import Button from '../inputs/button'
import TextInput from '../inputs/text'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { InsertWebHookData, InsertWebHookSchema } from '@/entities/webhook'

type WebHooksConfigurationProps = {
    webhooks: {
        id: string
        url: string
        category: 'SELL' | 'LOGS'
    }[]
    store: string
}

export default function WebHooksConfiguration({
    webhooks,
    store
}: WebHooksConfigurationProps) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting, defaultValues }
    } = useForm<InsertWebHookData>({
        resolver: zodResolver(InsertWebHookSchema),
        defaultValues: {
            storeId: store,
            sell: webhooks.find(webhook => webhook.category === 'SELL')?.url,
            logs: webhooks.find(webhook => webhook.category === 'LOGS')?.url
        }
    })

    const [creating, setCreating] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const saveWebhook = async (data: InsertWebHookData) => {
        setResult(null)
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
                setResult('Não foi possível salvar os webhooks :(')
            } else {
                reset()
                setCreating(false)
                router.refresh()
            }
        } catch (e) {
            setResult('Não foi possível salvar os webhooks :(')
        }
    }

    useEffect(() => {
        const sell = webhooks.find(webhook => webhook.category === 'SELL')
        const logs = webhooks.find(webhook => webhook.category === 'LOGS')

        if (sell !== defaultValues?.sell) {
            setValue('sell', sell?.url)
        }

        if (logs !== defaultValues?.logs) {
            setValue('logs', logs?.url)
        }
    }, [defaultValues?.logs, defaultValues?.sell, setValue, webhooks])

    return (
        <form
            onSubmit={handleSubmit(saveWebhook)}
            className="mt-2 flex flex-col items-stretch gap-4"
        >
            <TextInput
                {...register('sell')}
                label="Canal de Vendas:"
                type="url"
                autoComplete="none"
                error={errors.sell?.message}
                placeholder="https://discord.com/api/webhooks/..."
            />
            <TextInput
                {...register('logs')}
                label="Registros do Sistema:"
                type="url"
                autoComplete="none"
                error={errors.logs?.message}
                placeholder="https://discord.com/api/webhooks/..."
            />
            <Button
                disabled={isSubmitting || creating}
                component="button"
                type="submit"
                color="primary"
                size="sm"
                text={creating ? 'Salvando' : 'Salvar'}
            />
            {result && (
                <p className="w-full pt-1 text-center text-xs text-red-700">
                    {result}
                </p>
            )}
        </form>
    )
}
