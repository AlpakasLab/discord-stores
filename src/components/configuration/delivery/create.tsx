'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import TextInput from '@/components/inputs/text'
import Button from '@/components/inputs/button'
import CheckboxInput from '@/components/inputs/checkbox'
import { useStoreContext } from '@/components/store/context'
import {
    DeliveryValueData,
    DeliveryValueSchema
} from '@/entities/deliveryValue'
import toast from 'react-hot-toast'

export type CreateDeliveryValuesDialogHandles = {
    open: (storeId: string) => void
    edit: (
        storeId: string,
        value: {
            id: string
            description: string
            value: number
        }
    ) => void
}

const CreateDeliveryValuesDialog =
    React.forwardRef<CreateDeliveryValuesDialogHandles>((_, ref) => {
        const { themed } = useStoreContext()
        const router = useRouter()

        const {
            register,
            handleSubmit,
            reset,
            setValue,
            formState: { errors, isSubmitting }
        } = useForm<DeliveryValueData>({
            resolver: zodResolver(DeliveryValueSchema)
        })

        const [creating, setCreating] = useState(false)
        const [isEditing, setIsEditing] = useState(false)

        const [dialogData, setDialogData] = useState<{
            opened: boolean
        }>({
            opened: false
        })

        const closeDialog = () => {
            setDialogData({
                opened: false
            })
            setIsEditing(false)
            setCreating(false)
            reset()
        }

        const createRole = async (data: DeliveryValueData) => {
            setCreating(true)

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/delivery/values`,
                    {
                        method: isEditing ? 'PUT' : 'POST',
                        body: JSON.stringify(data)
                    }
                )

                setCreating(false)

                if (!response.ok) {
                    toast.error('Não foi possível salvar o valor de entrega :(')
                } else {
                    closeDialog()
                    router.refresh()
                }
            } catch (e) {
                toast.error('Não foi possível salvar o valor de entrega :(')
            }
        }

        useImperativeHandle(ref, () => {
            return {
                open(storeId) {
                    setDialogData({
                        opened: true
                    })
                    setValue('store', storeId)
                },
                edit(storeId, value) {
                    setDialogData({
                        opened: true
                    })
                    setIsEditing(true)
                    setValue('value', value.value)
                    setValue('description', value.description)
                    setValue('store', storeId)
                    setValue('id', value.id)
                }
            }
        })

        return (
            <Dialog
                open={dialogData.opened}
                onClose={() => {
                    closeDialog()
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex w-full max-w-xl flex-col items-center rounded bg-zinc-800 p-5 text-white">
                        <Dialog.Title className="mb-5 text-xl font-semibold">
                            {isEditing ? 'Editando Valor' : 'Novo Valor'}
                        </Dialog.Title>

                        <form
                            onSubmit={handleSubmit(createRole)}
                            className="grid w-full grid-cols-2 gap-5"
                        >
                            <TextInput
                                {...register('description')}
                                label="Descrição:"
                                type="text"
                                maxLength={255}
                                autoComplete="none"
                                placeholder="Região X, Até local Y, Local B"
                                error={errors.description?.message}
                            />
                            <TextInput
                                {...register('value')}
                                label="Valor:"
                                type="number"
                                min={0}
                                autoComplete="none"
                                placeholder="250"
                                error={errors.value?.message}
                            />
                            <div className="col-span-full flex items-center justify-center">
                                <Button
                                    disabled={isSubmitting || creating}
                                    component="button"
                                    type="submit"
                                    text={creating ? 'Salvando...' : 'Salvar'}
                                    size="sm"
                                    color={
                                        themed ? 'custom-primary' : 'primary'
                                    }
                                />
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    })

CreateDeliveryValuesDialog.displayName = 'CreateDeliveryValuesDialog'
export default CreateDeliveryValuesDialog
