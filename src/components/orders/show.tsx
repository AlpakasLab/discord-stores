'use client'

import { getDateHourString } from '@/utils/date'
import { numberToMoney } from '@/utils/formatter'
import { Dialog } from '@headlessui/react'
import moment from 'moment'
import React, { useState } from 'react'
import { FaSpinner, FaTrashAlt } from 'react-icons/fa'
import Button from '../inputs/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type ShowOrdersProps = {
    orders: {
        id: string
        employeeName: string
        employee: {
            id: string
            name: string
            userId: string
            storeId: string
            status: 'ACTIVE' | 'DISABLED' | 'PENDING'
            employeeRoleId: string | null
        } | null
        client: string
        total: number
        employeeComission: number
        storeComission: number
        delivery: number | null
        discount: number | null
        createdAt: Date | null
        items: {
            values: {
                name: string
                quantity: number
                unitPrice: number
            }[]
        }
    }[]
}

export default function ShowOrders({ orders }: ShowOrdersProps) {
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [idToDelete, setIdToDelete] = useState<string | null>(null)

    const getClientTotal = (total: number, discount: number | null) => {
        if (discount) {
            return `${numberToMoney(total - (discount * total) / 100)}`
        } else {
            return `${numberToMoney(total)}`
        }
    }

    const deleteOrder = async () => {
        setDeleting(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/order?id=${idToDelete}`,
                {
                    method: 'DELETE'
                }
            )

            if (!response.ok) {
                setDeleting(false)
                toast.error('Não foi possível deletar a venda :(')
            } else {
                toast.success('Venda deletada com sucesso!')
                setDeleting(false)
                setOpenDeleteDialog(false)
                setIdToDelete(null)
                router.refresh()
            }
        } catch (e) {
            toast.error('Não foi possível deletar a venda :(')
        }
    }

    return (
        <>
            <table className="mt-4 w-full table-auto">
                <thead>
                    <tr className="border-b border-t border-zinc-800">
                        <th className="py-2 text-left text-base font-semibold text-zinc-400">
                            Vendedor
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Cliente
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Total Items
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Delivery
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            % Desconto
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Total Líquido
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Data
                        </th>
                        <th className="py-2 text-end text-base font-semibold text-zinc-400">
                            Remover
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {React.Children.toArray(
                        orders.map(order => (
                            <tr className="group">
                                <td className="py-2 text-sm text-zinc-300 group-last:pb-0">
                                    {order.employeeName}
                                </td>
                                <td className="py-2 text-center text-sm text-zinc-300 group-last:pb-0">
                                    {order.client}
                                </td>
                                <td className="py-2 text-center text-sm text-zinc-300 group-last:pb-0">
                                    {numberToMoney(order.total)}
                                </td>

                                <td className="py-2 text-center text-sm text-zinc-300 group-last:pb-0">
                                    {order.delivery !== null
                                        ? numberToMoney(order.delivery)
                                        : '---'}
                                </td>
                                <td className="py-2 text-center text-sm text-zinc-300 group-last:pb-0">
                                    {order.discount !== null
                                        ? `${order.discount}%`
                                        : '---'}
                                </td>
                                <td className="py-2 text-center text-sm text-green-500 group-last:pb-0">
                                    {getClientTotal(
                                        order.total,
                                        order.discount
                                    )}
                                </td>
                                <td className="py-2 text-center text-sm text-zinc-300 group-last:pb-0">
                                    {moment
                                        .utc(order.createdAt)
                                        .local()
                                        .format(`DD/MM/YYYY - HH:mm`)}
                                </td>
                                <td className="py-2 pr-6 text-end text-sm text-zinc-300 group-last:pb-0">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenDeleteDialog(true)
                                            setIdToDelete(order.id)
                                        }}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Dialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false)
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex w-full max-w-xl flex-col items-center rounded bg-zinc-800 p-5 text-white">
                        <Dialog.Title className="mb-5 text-xl font-semibold">
                            Deletar Venda
                        </Dialog.Title>
                        <Dialog.Description className="text-center text-base text-zinc-400">
                            Ao remover uma venda do sistema ela também remove a
                            mensagem do Discord. Este processo não pode ser
                            desfeito!
                        </Dialog.Description>
                        {deleting ? (
                            <p className="mt-8 w-full text-center text-zinc-200">
                                <FaSpinner className="mr-2 inline animate-spin" />{' '}
                                Removendo Venda...
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
                                        setOpenDeleteDialog(false)
                                    }}
                                />
                                <Button
                                    component="button"
                                    type="button"
                                    text="Prosseguir"
                                    color="neutral"
                                    size="sm"
                                    onClick={() => {
                                        deleteOrder()
                                    }}
                                />
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    )
}
