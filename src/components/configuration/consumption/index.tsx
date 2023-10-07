'use client'

import { useRouter } from 'next/navigation'
import Button from '../../inputs/button'
import TextInput from '../../inputs/text'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import {
    ConsumptionWebHookData,
    ConsumptionWebHookSchema
} from '@/entities/webhook'
import { useStoreContext } from '@/components/store/context'

type ConsumptionConfigurationProps = {
    webhook?: {
        id: string
        url: string
    }
    store: string
}

export default function ConsumptionConfiguration({
    webhook,
    store
}: ConsumptionConfigurationProps) {
    const { themed } = useStoreContext()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting, defaultValues }
    } = useForm<ConsumptionWebHookData>({
        resolver: zodResolver(ConsumptionWebHookSchema),
        defaultValues: {
            storeId: store,
            consumption: webhook?.url
        }
    })

    const [creating, setCreating] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const saveWebhook = async (data: ConsumptionWebHookData) => {
        setResult(null)
        setCreating(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/discord/consumption`,
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
        if (webhook && webhook.url !== defaultValues?.consumption) {
            setValue('consumption', webhook?.url)
        }
    }, [defaultValues?.consumption, setValue, webhook])

    return (
        <form
            onSubmit={handleSubmit(saveWebhook)}
            className="mt-2 flex flex-col items-stretch gap-4"
        >
            <TextInput
                {...register('consumption')}
                label="Link do Webhook:"
                type="url"
                autoComplete="none"
                error={errors.consumption?.message}
                placeholder="https://discord.com/api/webhooks/..."
            />
            <Button
                disabled={isSubmitting || creating}
                component="button"
                type="submit"
                color={themed ? 'custom-primary' : 'primary'}
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
