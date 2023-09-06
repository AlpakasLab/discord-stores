'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import TextInput from '@/components/inputs/text'
import Button from '@/components/inputs/button'
import { EmployeeRoleData, EmployeeRoleSchema } from '@/entities/employeeRole'
import CheckboxInput from '@/components/inputs/checkbox'

export type CreateEmployeeRoleDialogHandles = {
    open: (storeId: string) => void
    edit: (role: {
        name: string
        comission: number
        manager: boolean
        id: string
        store: string
    }) => void
}

const CreateEmployeeRoleDialog =
    React.forwardRef<CreateEmployeeRoleDialogHandles>((_, ref) => {
        const router = useRouter()

        const {
            register,
            handleSubmit,
            reset,
            setValue,
            formState: { errors, isSubmitting }
        } = useForm<EmployeeRoleData>({
            resolver: zodResolver(EmployeeRoleSchema)
        })

        const [creating, setCreating] = useState(false)
        const [result, setResult] = useState<string | null>(null)
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
            setResult(null)
            setCreating(false)
            reset()
        }

        const createProduct = async (data: EmployeeRoleData) => {
            setResult(null)
            setCreating(true)

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/employee/role`,
                    {
                        method: isEditing ? 'PUT' : 'POST',
                        body: JSON.stringify(data)
                    }
                )

                setCreating(false)

                if (!response.ok) {
                    setResult('Não foi possível salvar o cargo :(')
                } else {
                    closeDialog()
                    router.refresh()
                }
            } catch (e) {
                setResult('Não foi possível salvar o cargo :(')
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
                edit(role) {
                    setDialogData({
                        opened: true
                    })
                    setIsEditing(true)
                    setValue('comission', role.comission)
                    setValue('manager', role.manager)
                    setValue('name', role.name)
                    setValue('store', role.store)
                    setValue('id', role.id)
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
                            {isEditing ? 'Editando Cargo' : 'Novo Cargo'}
                        </Dialog.Title>

                        <form
                            onSubmit={handleSubmit(createProduct)}
                            className="grid w-full grid-cols-2 gap-5"
                        >
                            <TextInput
                                {...register('name')}
                                label="Nome:"
                                type="text"
                                autoComplete="none"
                                placeholder="Gerente, Vendedor, Aprendiz"
                                error={errors.name?.message}
                            />
                            <TextInput
                                {...register('comission')}
                                label="Porcentagem de Comissão:"
                                type="number"
                                autoComplete="none"
                                placeholder="50"
                                max={100}
                                min={0}
                                error={errors.comission?.message}
                            />
                            <CheckboxInput
                                type="checkbox"
                                {...register('manager')}
                                error={errors.manager?.message}
                            >
                                Este cargo pode gerenciar a loja.
                            </CheckboxInput>
                            <div className="col-span-full flex items-center justify-center">
                                <Button
                                    disabled={isSubmitting || creating}
                                    component="button"
                                    type="submit"
                                    text={creating ? 'Salvando...' : 'Salvar'}
                                    size="sm"
                                    color="secondary"
                                />
                            </div>
                            {result && (
                                <p className="col-span-full w-full pt-1 text-center text-xs text-red-700">
                                    {result}
                                </p>
                            )}
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    })

CreateEmployeeRoleDialog.displayName = 'CreateEmployeeRoleDialog'
export default CreateEmployeeRoleDialog
