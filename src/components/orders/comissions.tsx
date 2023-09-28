'use client'

import { numberToMoney } from '@/utils/formatter'
import React from 'react'

type ShowComissionsProps = {
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

export default function ShowComissions({ orders }: ShowComissionsProps) {
    const getStoreTotal = () => {
        let totalStore = 0

        orders.forEach(order => {
            totalStore += order.storeComission
        })

        return numberToMoney(totalStore)
    }

    const getComissionsByEmployee = () => {
        const employees = new Map<
            string,
            { name: string; sells: number; comission: number; store: number }
        >()

        orders.forEach(order => {
            if (!order.employee) return

            const oldValue = employees.get(order.employee.id)

            if (oldValue) {
                employees.set(order.employee.id, {
                    name: order.employee.name,
                    comission: oldValue.comission + order.employeeComission,
                    store: oldValue.store + order.storeComission,
                    sells: oldValue.sells + 1
                })
            } else {
                employees.set(order.employee.id, {
                    name: order.employee.name,
                    comission: order.employeeComission,
                    store: order.storeComission,
                    sells: 1
                })
            }
        })

        return Array.from(employees.values())
    }

    return (
        <>
            <table className="mt-4 w-full table-auto">
                <thead>
                    <tr className="border-b border-t border-zinc-800">
                        <th className="py-2 text-left text-base font-semibold text-zinc-400">
                            Nome{' '}
                            <span className="text-xs text-zinc-400">
                                (Vendas)
                            </span>
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Comissão
                        </th>
                        <th className="py-2 text-end text-base font-semibold text-zinc-400">
                            Loja
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {React.Children.toArray(
                        getComissionsByEmployee().map(employee => (
                            <tr>
                                <td className="py-2 text-sm text-zinc-300">
                                    {employee.name}{' '}
                                    <span className="text-xs text-zinc-400">
                                        ({employee.sells})
                                    </span>
                                </td>
                                <td className="py-2 text-center text-sm text-zinc-300">
                                    {numberToMoney(employee.comission)}
                                </td>
                                <td className="py-2 text-end text-sm text-green-500">
                                    {numberToMoney(employee.store)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
                <tfoot>
                    <tr className="border-t border-zinc-800">
                        <td
                            colSpan={2}
                            className="pt-2 text-base font-semibold text-zinc-300"
                        >
                            Total da Loja
                        </td>
                        <td className="pt-2 text-end text-base font-semibold text-green-500">
                            {getStoreTotal()}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}
