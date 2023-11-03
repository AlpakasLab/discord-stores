'use client'

import Button from '@/components/inputs/button'
import TextInput from '@/components/inputs/text'
import { StoreColorsData, StoreColorsSchema } from '@/entities/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type StoreColorsProps = {
    store: string
    colors?: {
        primaryColor: string | null
        secondaryColor: string | null
    }
}

export default function StoreColors({ store, colors }: StoreColorsProps) {
    const router = useRouter()

    const [saving, setSaving] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<StoreColorsData>({
        resolver: zodResolver(StoreColorsSchema),
        defaultValues: {
            id: store
        }
    })

    const saveTempleate = async (data: StoreColorsData) => {
        setSaving(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/store/`,
                {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }
            )

            setSaving(false)

            if (!response.ok) {
                toast.error('Não foi possível salvar as cores :(')
            } else {
                toast.success('Cores atualizadas com sucesso!')
                router.refresh()
                reset()
            }
        } catch (e) {
            toast.error('Não foi possível salvar as cores :(')
        }
    }

    useEffect(() => {
        if (colors !== undefined) {
            if (colors.primaryColor)
                setValue('primaryColor', colors.primaryColor)
            if (colors.secondaryColor)
                setValue('secondaryColor', colors.secondaryColor)
        }
    }, [colors, setValue])

    return (
        <form
            onSubmit={handleSubmit(saveTempleate)}
            className="flex w-full items-end justify-start gap-5"
        >
            <div className="w-full max-w-xs">
                <TextInput
                    {...register('primaryColor')}
                    label="Cor Principal:"
                    type="color"
                    autoComplete="none"
                    placeholder=""
                    error={errors.primaryColor?.message}
                />
            </div>
            <div className="w-full max-w-xs">
                <TextInput
                    {...register('secondaryColor')}
                    label="Cor Secundária:"
                    type="color"
                    autoComplete="none"
                    placeholder=""
                    error={errors.secondaryColor?.message}
                />
            </div>
            <div className="col-span-full flex items-center justify-center">
                <Button
                    disabled={isSubmitting || saving}
                    component="button"
                    type="submit"
                    text={'Salvar'}
                    size="sm"
                    color="neutral"
                />
            </div>
        </form>
    )
}
