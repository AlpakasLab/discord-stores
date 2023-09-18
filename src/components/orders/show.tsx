'use client'

import { getDateHourString } from '@/utils/date'
import { numberToMoney } from '@/utils/formatter'
import moment from 'moment'
import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'

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
        createdAt: Date
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
    const getClientTotal = (total: number, discount: number | null) => {
        if (discount) {
            return `${numberToMoney(total - (discount * total) / 100)}`
        } else {
            return `${numberToMoney(total)}`
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
                                    <button type="button" onClick={() => {}}>
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    )
}
