'use client'

import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import Button from '../inputs/button'
import { FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export type DeleteEmployeeDialogHandles = {
    open: (employee: { id: string; name: string }) => void
}

const DeleteEmployeeDialog = React.forwardRef<DeleteEmployeeDialogHandles>(
    (_, ref) => {
        const router = useRouter()

        const [dialogData, setDialogData] = useState<{
            opened: boolean
        }>({
            opened: false
        })

        const [deleting, setDeleting] = useState(false)
        const [employeeData, setEmployeeData] = useState<{
            id: string
            name: string
        } | null>(null)

        useImperativeHandle(ref, () => {
            return {
                open(employee) {
                    setDialogData({
                        opened: true
                    })
                    setEmployeeData(employee)
                }
            }
        })

        const deleteProduct = async () => {
            if (!employeeData) return
            setDeleting(true)

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/employee?id=${employeeData.id}`,
                    {
                        method: 'DELETE'
                    }
                )

                if (!response.ok) {
                    setDeleting(false)
                    toast.error('Não foi possível deletar o funcionário :(')
                } else {
                    toast.success('Funcionário deletado com sucesso!')
                    setDeleting(false)
                    setDialogData({
                        opened: false
                    })
                    setEmployeeData(null)
                    router.refresh()
                }
            } catch (e) {
                toast.error('Não foi possível deletar o funcionário :(')
            }
        }

        return (
            <Dialog
                open={dialogData.opened}
                onClose={() => {
                    setDialogData({
                        opened: false
                    })
                    setEmployeeData(null)
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex w-full max-w-xl flex-col items-center rounded bg-zinc-800 p-5 text-white">
                        <Dialog.Title className="mb-5 text-xl font-semibold">
                            Deletar Funcionário
                        </Dialog.Title>
                        {employeeData && (
                            <Dialog.Description className="text-center text-base text-zinc-400">
                                Você tem certeza que deseja deletar&nbsp;
                                <strong className="font-semibold">
                                    {employeeData.name}
                                </strong>
                                ? Todas as vendas deste funcionário serão
                                removidas e esta ação não pode ser desfeita, se
                                estiver tudo correto prossiga com a ação.
                            </Dialog.Description>
                        )}
                        {deleting ? (
                            <p className="mt-8 w-full text-center text-zinc-200">
                                <FaSpinner className="mr-2 inline animate-spin" />{' '}
                                Removendo Funcionário...
                            </p>
                        ) : (
                            <div className="mt-8 flex w-full items-center gap-x-4">
                                <Button
                                    component="button"
                                    type="button"
                                    text="Cancelar"
                                    color="success"
                                    size="sm"
                                    onClick={() => {
                                        setDialogData({
                                            opened: false
                                        })
                                        setEmployeeData(null)
                                    }}
                                />
                                <Button
                                    component="button"
                                    type="button"
                                    text="Prosseguir"
                                    color="neutral"
                                    size="sm"
                                    onClick={() => {
                                        deleteProduct()
                                    }}
                                />
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    }
)

DeleteEmployeeDialog.displayName = 'DeleteEmployeeDialog'
export default DeleteEmployeeDialog
