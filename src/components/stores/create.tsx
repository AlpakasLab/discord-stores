'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import TextInput from '../inputs/text'
import { InsertStoreData, InsertStoreSchema } from '@/entities/store'
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
        } = useForm<InsertStoreData>({
            resolver: zodResolver(InsertStoreSchema)
        })

        const [creating, setCreating] = useState(false)
        const [result, setResult] = useState<string | null>(null)

        const [dialogData, setDialogData] = useState<{
            opened: boolean
            guildId: null | string
        }>({
            opened: false,
            guildId: null
        })

        const createStore = async (data: InsertStoreData) => {
            if (!dialogData || !dialogData.guildId)
                return setResult('Não foi possível registrar a loja :(')

            setResult(null)
            setCreating(true)

            try {
                const requestUrl = new URL(
                    `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/store/`
                )
                requestUrl.searchParams.append('id', dialogData.guildId)

                const response = await fetch(requestUrl, {
                    method: 'POST',
                    body: JSON.stringify(data)
                })

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
                        opened: true,
                        guildId: id
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
                        opened: false,
                        guildId: null
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
                            <Button
                                disabled={isSubmitting || creating}
                                component="button"
                                type="submit"
                                text={creating ? 'Registrando...' : 'Criar'}
                                size="sm"
                            />
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    }
)

CreateStoreDialog.displayName = 'CreateStoreDialog'
export default CreateStoreDialog
