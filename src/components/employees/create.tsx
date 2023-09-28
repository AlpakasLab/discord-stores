'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import TextInput from '@/components/inputs/text'
import Button from '@/components/inputs/button'
import { EmployeeData, EmployeeSchema } from '@/entities/employee'
import SelectInput from '../inputs/select'
import { FaSpinner } from 'react-icons/fa'
import { useStoreContext } from '../store/context'

export type CreateEmployeeDialogHandles = {
    edit: (employee: {
        name: string
        status: 'ACTIVE' | 'DISABLED' | 'PENDING'
        role: string | null
        roleId: string | null
        id: string
        store: string
    }) => void
}

const CreateEmployeeDialog = React.forwardRef<CreateEmployeeDialogHandles>(
    (_, ref) => {
        const { themed } = useStoreContext()
        const router = useRouter()

        const {
            register,
            handleSubmit,
            reset,
            setValue,
            resetField,
            formState: { errors, isSubmitting }
        } = useForm<EmployeeData>({
            resolver: zodResolver(EmployeeSchema)
        })

        const [roles, setRoles] = useState<
            null | { label: string; value: string }[]
        >(null)
        const [creating, setCreating] = useState(false)
        const [result, setResult] = useState<string | null>(null)
        const [storeId, setStoreId] = useState<string | null>(null)
        const [isAdminRole, setIsAdminRole] = useState(false)

        const [statusDefaultValue, setStatusDefaultValue] = useState<
            null | 'ACTIVE' | 'DISABLED' | 'PENDING'
        >(null)
        const [roleDefaultValue, setRoleDefaultValue] = useState<null | string>(
            null
        )

        const [dialogData, setDialogData] = useState<{
            opened: boolean
        }>({
            opened: false
        })

        const closeDialog = () => {
            setDialogData({
                opened: false
            })
            setResult(null)
            setCreating(false)
            setStatusDefaultValue(null)
            setRoleDefaultValue(null)
            setIsAdminRole(false)
            reset()
        }

        const saveEmployee = async (data: EmployeeData) => {
            setResult(null)
            setCreating(true)

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/employee`,
                    {
                        method: 'PUT',
                        body: JSON.stringify(data)
                    }
                )

                setCreating(false)

                if (!response.ok) {
                    setResult('Não foi possível salvar o funcionário :(')
                } else {
                    closeDialog()
                    router.refresh()
                }
            } catch (e) {
                setResult('Não foi possível salvar o funcionário :(')
            }
        }

        useImperativeHandle(ref, () => {
            return {
                edit(employee) {
                    setDialogData({
                        opened: true
                    })
                    setStatusDefaultValue(employee.status)
                    setRoleDefaultValue(employee.roleId)
                    setValue('name', employee.name)
                    if (employee.roleId) setValue('role', employee.roleId)
                    setValue('status', employee.status)
                    setValue('id', employee.id)
                    setStoreId(employee.store)

                    if (employee.role === 'Proprietário') {
                        setIsAdminRole(true)
                    }
                }
            }
        })

        useEffect(() => {
            if (storeId && roles === null) {
                const url = new URL(
                    `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/employee/role/`
                )
                url.searchParams.append('id', storeId)

                fetch(url)
                    .then(response => response.json())
                    .then(
                        (response: { data: { name: string; id: string }[] }) =>
                            setRoles(
                                response.data.map(item => ({
                                    label: item.name,
                                    value: item.id
                                }))
                            )
                    )
                    .catch(() => {
                        setRoles([])
                    })
            }
        }, [roles, storeId])

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
                            Editando Funcionário
                        </Dialog.Title>

                        {roles === null ? (
                            <div className="py-5">
                                <p className="flex animate-pulse items-center justify-center gap-x-2 text-sm">
                                    <FaSpinner className="animate-spin text-base" />
                                    Carregando Informações
                                </p>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit(saveEmployee)}
                                className="grid w-full grid-cols-2 gap-5"
                            >
                                <div className="col-span-full">
                                    <TextInput
                                        {...register('name')}
                                        label="Nome:"
                                        type="text"
                                        autoComplete="none"
                                        placeholder="Nome Sobrenome"
                                        error={errors.name?.message}
                                    />
                                </div>
                                <SelectInput
                                    disabled={isAdminRole}
                                    mode="single"
                                    label="Status:"
                                    defaultOption={statusDefaultValue}
                                    options={[
                                        { label: 'Ativo', value: 'ACTIVE' },
                                        { label: 'Inativo', value: 'DISABLED' },
                                        {
                                            label: 'Pendente',
                                            value: 'PENDING',
                                            disabled: true
                                        }
                                    ]}
                                    onSelectOption={option => {
                                        if (option) {
                                            setValue(
                                                'status',
                                                option.value as
                                                    | 'ACTIVE'
                                                    | 'DISABLED'
                                                    | 'PENDING',
                                                {
                                                    shouldValidate: true
                                                }
                                            )
                                        } else {
                                            resetField('status', {
                                                keepError: false
                                            })
                                        }
                                    }}
                                    error={errors.status?.message}
                                />
                                <SelectInput
                                    disabled={isAdminRole}
                                    mode="single"
                                    label="Cargo:"
                                    defaultOption={roleDefaultValue}
                                    options={roles.map(role => {
                                        if (role.label === 'Proprietário') {
                                            return {
                                                ...role,
                                                disabled: true
                                            }
                                        } else {
                                            return role
                                        }
                                    })}
                                    onSelectOption={option => {
                                        if (option) {
                                            setValue(
                                                'role',
                                                option.value.toString(),
                                                {
                                                    shouldValidate: true
                                                }
                                            )
                                        } else {
                                            resetField('role', {
                                                keepError: false
                                            })
                                        }
                                    }}
                                    error={errors.role?.message}
                                />
                                <div className="col-span-full flex items-center justify-center">
                                    <Button
                                        disabled={isSubmitting || creating}
                                        component="button"
                                        type="submit"
                                        text={
                                            creating ? 'Salvando...' : 'Salvar'
                                        }
                                        size="sm"
                                        color={
                                            themed
                                                ? 'custom-primary'
                                                : 'primary'
                                        }
                                    />
                                </div>
                                {result && (
                                    <p className="col-span-full w-full pt-1 text-center text-xs text-red-700">
                                        {result}
                                    </p>
                                )}
                            </form>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    }
)

CreateEmployeeDialog.displayName = 'CreateEmployeeDialog'
export default CreateEmployeeDialog
