'use client'

import Button from '@/components/inputs/button'
import CheckboxInput from '@/components/inputs/checkbox'
import SelectInput from '@/components/inputs/select'
import TextInput from '@/components/inputs/text'
import { useStoreContext } from '@/components/store/context'
import {
    TempleateWebHookSchema,
    TempleateWebhookData
} from '@/entities/webhook'
import { Dialog } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaPlusCircle, FaTrash } from 'react-icons/fa'

export const SELL_TEMPLEATE_FIELDS = {
    'employee-name': 'Nome do Vendedor',
    'client-name': 'Nome do Cliente',
    items: 'Lista de Items',
    'discount-percentage': '% Desconto',
    total: 'Valor Total',
    'total-client': 'Valor Cliente',
    delivery: 'Valor do Delivery',
    comission: 'Comissão da Loja'
}

type SellWebhookTempleateProps = {
    webhook: {
        id: string
        image: string | null
        title: string | null
        color: number | null
        fields: {
            values: {
                title: string
                value: string
                inline?: boolean | undefined
            }[]
        } | null
    }
}

export default function SellWebhookTempleate({
    webhook
}: SellWebhookTempleateProps) {
    const { themed } = useStoreContext()
    const router = useRouter()

    const [opened, setOpened] = useState(false)
    const [saving, setSaving] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        resetField,
        control,
        formState: { errors, isSubmitting }
    } = useForm<TempleateWebhookData>({
        resolver: zodResolver(TempleateWebHookSchema)
    })

    const {
        append: appendFields,
        remove: removeFields,
        fields
    } = useFieldArray({
        control: control,
        name: 'fields'
    })

    const saveTempleate = async (data: TempleateWebhookData) => {
        setSaving(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/discord/templeate/`,
                {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }
            )

            setSaving(false)

            if (!response.ok) {
                toast.error('Não foi possível salvar o templeate :(')
            } else {
                router.refresh()
                reset()
                removeFields()
                setOpened(false)
            }
        } catch (e) {
            toast.error('Não foi possível salvar o templeate :(')
        }
    }

    useEffect(() => {
        setValue('id', webhook.id)
        if (webhook.title) setValue('title', webhook.title)
        if (webhook.image) setValue('image', webhook.image)
        if (webhook.color)
            setValue('color', `#${Math.abs(webhook.color).toString(16)}`)
        if (webhook.fields) {
            webhook.fields.values.forEach(field => {
                appendFields({
                    title: field.title,
                    value: field.value,
                    inline: field.inline
                })
            })
        }

        return () => {
            removeFields()
        }
    }, [appendFields, removeFields, setValue, webhook])

    return (
        <>
            <Button
                component="button"
                type="button"
                onClick={() => {
                    setOpened(true)
                }}
                color={themed ? 'custom-secondary' : 'secondary'}
                size="sm"
                text="Customizar"
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
                        <Dialog.Panel className="flex w-full max-w-3xl flex-col items-center rounded bg-zinc-800 p-5 text-white">
                            <Dialog.Title className="mb-5 text-xl font-semibold">
                                Customizando Webhook de Vendas
                            </Dialog.Title>

                            <form
                                onSubmit={handleSubmit(saveTempleate)}
                                className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3"
                            >
                                <TextInput
                                    {...register('title')}
                                    label="Título:"
                                    type="text"
                                    autoComplete="none"
                                    placeholder="💰 Registro de Venda"
                                    error={errors.title?.message}
                                />
                                <TextInput
                                    {...register('image')}
                                    label="Imagem:"
                                    type="url"
                                    autoComplete="none"
                                    placeholder="https://i.imgur.com/......jpeg"
                                    error={errors.image?.message}
                                />
                                <TextInput
                                    {...register('color')}
                                    label="Cor:"
                                    type="color"
                                    autoComplete="none"
                                    placeholder=""
                                    error={errors.color?.message}
                                />
                                <div className="col-span-full flex w-full flex-col gap-y-4 border-t border-zinc-700 pt-2">
                                    <div>
                                        <p className="text-sm">Campos:</p>
                                    </div>
                                    {React.Children.toArray(
                                        fields.map((form, index) => (
                                            <div className="relative grid w-full grid-cols-3 place-items-start gap-x-4 rounded-md border border-zinc-600 p-4 text-zinc-400">
                                                <TextInput
                                                    key={form.id}
                                                    {...register(
                                                        `fields.${index}.title`
                                                    )}
                                                    label="Título:"
                                                    type="text"
                                                    autoComplete="none"
                                                    placeholder="Valor, Comissão, Cliente"
                                                    error={
                                                        errors.fields
                                                            ? errors.fields[
                                                                  index
                                                              ]?.title?.message
                                                            : undefined
                                                    }
                                                />
                                                <SelectInput
                                                    mode="single"
                                                    label="Valor:"
                                                    defaultOption={form.value}
                                                    options={Object.entries(
                                                        SELL_TEMPLEATE_FIELDS
                                                    ).map(([key, value]) => ({
                                                        label: value,
                                                        value: key
                                                    }))}
                                                    onSelectOption={option => {
                                                        if (option) {
                                                            setValue(
                                                                `fields.${index}.value`,
                                                                option.value,
                                                                {
                                                                    shouldValidate:
                                                                        true
                                                                }
                                                            )
                                                        } else {
                                                            resetField(
                                                                `fields.${index}.value`,
                                                                {
                                                                    keepError:
                                                                        false
                                                                }
                                                            )
                                                        }
                                                    }}
                                                    error={
                                                        errors.fields
                                                            ? errors.fields[
                                                                  index
                                                              ]?.value?.message
                                                            : undefined
                                                    }
                                                />
                                                <div className="mt-7 flex h-full items-start">
                                                    <CheckboxInput
                                                        className={
                                                            themed
                                                                ? 'text-custom-primary'
                                                                : undefined
                                                        }
                                                        {...register(
                                                            `fields.${index}.inline`
                                                        )}
                                                        error={
                                                            errors.fields
                                                                ? errors.fields[
                                                                      index
                                                                  ]?.inline
                                                                      ?.message
                                                                : undefined
                                                        }
                                                    >
                                                        Esse campo deve ficar na
                                                        horizontal?
                                                    </CheckboxInput>
                                                </div>
                                                {fields.length - 1 ===
                                                    index && (
                                                    <button
                                                        type="button"
                                                        className="absolute right-4 top-4 flex items-center gap-x-2 text-sm text-red-700"
                                                        onClick={() =>
                                                            removeFields(index)
                                                        }
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                    <button
                                        className="flex w-full items-center justify-center gap-x-2 rounded-md border border-zinc-600 p-4 text-zinc-400"
                                        type="button"
                                        onClick={() =>
                                            appendFields({
                                                title: '',
                                                value: '',
                                                inline: false
                                            })
                                        }
                                    >
                                        <FaPlusCircle />
                                        Adicionar Campo
                                    </button>
                                </div>
                                <div className="col-span-full flex items-center justify-center">
                                    <Button
                                        disabled={isSubmitting || saving}
                                        component="button"
                                        type="submit"
                                        text={'Salvar'}
                                        size="sm"
                                        color={
                                            themed
                                                ? 'custom-primary'
                                                : 'primary'
                                        }
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
