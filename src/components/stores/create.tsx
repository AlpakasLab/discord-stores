'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import TextInput from '../inputs/text'
import { StoreData, StoreSchema } from '@/entities/store'
import { useRouter } from 'next/navigation'
import Button from '../inputs/button'
export type CreateStoreDialogHandles = {
    open: (id: string) => void
}

const CreateStoreDialog = React.forwardRef<CreateStoreDialogHandles>(
    (_, ref) => {
        const router = useRouter()

        const {
            register,
            handleSubmit,
            reset,
            setValue,
            formState: { errors, isSubmitting }
        } = useForm<StoreData>({
            resolver: zodResolver(StoreSchema)
        })

        const [creating, setCreating] = useState(false)
        const [result, setResult] = useState<string | null>(null)

        const [dialogData, setDialogData] = useState<{
            opened: boolean
        }>({
            opened: false
        })

        const createStore = async (data: StoreData) => {
            setResult(null)
            setCreating(true)

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/store/`,
                    {
                        method: 'POST',
                        body: JSON.stringify(data)
                    }
                )

                if (!response.ok) {
                    setCreating(false)
                    setResult('Não foi possível registrar a loja :(')
                } else {
                    const data = await response.json()
                    router.push(`/stores/${data.id}/`)
                    reset()
                }
            } catch (e) {
                setResult('Não foi possível registrar a loja :(')
            }
        }

        useImperativeHandle(ref, () => {
            return {
                open(id) {
                    setDialogData({
                        opened: true
                    })
                    setValue('server', id)
                }
            }
        })

        return (
            <Dialog
                open={dialogData.opened}
                onClose={() => {
                    setDialogData({
                        opened: false
                    })
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex w-full max-w-md flex-col items-center rounded bg-zinc-800 p-5 text-white">
                        <Dialog.Title className="mb-5 text-xl font-semibold">
                            Criar nova loja
                        </Dialog.Title>
                        <form
                            onSubmit={handleSubmit(createStore)}
                            className="flex w-full flex-col gap-5"
                        >
                            <TextInput
                                {...register('name')}
                                label="Nome:"
                                type="text"
                                autoComplete="none"
                                placeholder="Minha Loja"
                                error={errors.name?.message}
                            />
                            <TextInput
                                {...register('ownerName')}
                                label="Nome do Proprietário (Você):"
                                type="text"
                                autoComplete="none"
                                placeholder="Nome Sobrenome"
                                error={errors.ownerName?.message}
                            />
                            <TextInput
                                {...register('comission')}
                                label="Porcentagem de Comissão do Proprietário (Cargo):"
                                type="number"
                                autoComplete="none"
                                placeholder="50"
                                max={100}
                                min={0}
                                error={errors.comission?.message}
                            />
                            <Button
                                disabled={isSubmitting || creating}
                                component="button"
                                type="submit"
                                text={creating ? 'Registrando...' : 'Criar'}
                                size="sm"
                            />
                            {result && (
                                <p className="w-full pt-1 text-center text-xs text-red-700">
                                    {result}
                                </p>
                            )}
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    }
)

CreateStoreDialog.displayName = 'CreateStoreDialog'
export default CreateStoreDialog
