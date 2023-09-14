'use client'

import Button from '@/components/inputs/button'
import TextInput from '@/components/inputs/text'
import { StoreColorsData, StoreColorsSchema } from '@/entities/store'
import { Dialog } from '@headlessui/react'
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

    const [opened, setOpened] = useState(false)
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
                router.refresh()
                reset()
                setOpened(false)
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
        <>
            <Button
                component="button"
                type="button"
                onClick={() => {
                    setOpened(true)
                }}
                color="neutral"
                size="sm"
                text="Customizar Cores"
            />
            <Dialog
                open={opened}
                onClose={() => {
                    setOpened(false)
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

                <div className="fixed inset-0 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel className="flex w-full max-w-xl flex-col items-center rounded bg-zinc-800 p-5 text-white">
                            <Dialog.Title className="mb-5 text-xl font-semibold">
                                Cores do Sistema
                            </Dialog.Title>

                            <form
                                onSubmit={handleSubmit(saveTempleate)}
                                className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5"
                            >
                                <TextInput
                                    {...register('primaryColor')}
                                    label="Cor Principal:"
                                    type="color"
                                    autoComplete="none"
                                    placeholder=""
                                    error={errors.primaryColor?.message}
                                />
                                <TextInput
                                    {...register('secondaryColor')}
                                    label="Cor Secundária:"
                                    type="color"
                                    autoComplete="none"
                                    placeholder=""
                                    error={errors.secondaryColor?.message}
                                />
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
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
