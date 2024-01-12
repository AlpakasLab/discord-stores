'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import TextInput from '../inputs/text'
import { useRouter } from 'next/navigation'
import Button from '../inputs/button'
import { RequestEntryData, RequestEntrySchema } from '@/entities/store'

export type RequestEntryDialogHandles = {
    open: (id?: string) => void
}

const RequestEntryDialog = React.forwardRef<RequestEntryDialogHandles>(
    (_, ref) => {
        const router = useRouter()

        const {
            register,
            handleSubmit,
            reset,
            setValue,
            formState: { errors, isSubmitting }
        } = useForm<RequestEntryData>({
            resolver: zodResolver(RequestEntrySchema)
        })

        const [creating, setCreating] = useState(false)
        const [result, setResult] = useState<string | null>(null)

        const [dialogData, setDialogData] = useState<{
            opened: boolean
            hasServer: boolean
        }>({
            opened: false,
            hasServer: false
        })

        const requestEntry = async (data: RequestEntryData) => {
            setResult(null)
            setCreating(true)

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/store/request`,
                    {
                        method: 'POST',
                        body: JSON.stringify(data)
                    }
                )

                setCreating(false)

                if (!response.ok) {
                    setResult('Não foi possível solicitar a entrada :(')
                } else {
                    setDialogData({ opened: false, hasServer: false })
                    reset()
                    router.refresh()
                }
            } catch (e) {
                setResult('Não foi possível solicitar a entrada :(')
            }
        }

        useImperativeHandle(ref, () => {
            return {
                open(id) {
                    if (id) {
                        setDialogData({
                            opened: true,
                            hasServer: true
                        })
                        setValue('server', id)
                    } else {
                        setDialogData({
                            opened: true,
                            hasServer: false
                        })
                    }
                }
            }
        })

        return (
            <Dialog
                open={dialogData.opened}
                onClose={() => {
                    setDialogData({
                        opened: false,
                        hasServer: false
                    })
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex w-full max-w-md flex-col items-center rounded bg-zinc-800 p-5 text-white">
                        <Dialog.Title className="mb-5 text-xl font-semibold">
                            Solicitar Entrada
                        </Dialog.Title>
                        <form
                            onSubmit={handleSubmit(requestEntry)}
                            className="flex w-full flex-col gap-5"
                        >
                            {!dialogData.hasServer && (
                                <TextInput
                                    {...register('server')}
                                    label="Código:"
                                    type="text"
                                    autoComplete="none"
                                    placeholder="5980b2b3-03e3-4166-b7a1-13d131dcd48a"
                                    error={errors.name?.message}
                                />
                            )}
                            <TextInput
                                {...register('name')}
                                label="Nome:"
                                type="text"
                                autoComplete="none"
                                placeholder="Nome Sobrenome"
                                error={errors.name?.message}
                            />
                            <Button
                                disabled={isSubmitting || creating}
                                component="button"
                                type="submit"
                                color="secondary"
                                text={creating ? 'Solicitando...' : 'Solicitar'}
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

RequestEntryDialog.displayName = 'RequestEntryDialog'
export default RequestEntryDialog
