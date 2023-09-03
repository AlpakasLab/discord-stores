'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import TextInput from '../inputs/text'
import { InsertStoreData, InsertStoreSchema } from '@/entities/store'

export type CreateStoreDialogHandles = {
    open: (id: string) => void
}

const CreateStoreDialog = React.forwardRef<CreateStoreDialogHandles>(
    (_, ref) => {
        const {
            register,
            control,
            handleSubmit,
            setValue,
            reset,
            resetField,
            formState: { errors, isSubmitting }
        } = useForm<InsertStoreData>({
            resolver: zodResolver(InsertStoreSchema)
        })

        const [dialogData, setDialogData] = useState<{
            opened: boolean
            guildId: null | string
        }>({
            opened: false,
            guildId: null
        })

        useImperativeHandle(ref, () => {
            return {
                open(id) {
                    setDialogData({
                        opened: true,
                        guildId: id
                    })
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
                        <form>
                            <TextInput />
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    }
)

CreateStoreDialog.displayName = 'CreateStoreDialog'
export default CreateStoreDialog
