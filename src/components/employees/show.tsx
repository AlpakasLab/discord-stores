'use client'

import React, { useRef } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import CreateEmployeeDialog, { CreateEmployeeDialogHandles } from './create'

type ShowEmployeesProps = {
    employees: {
        name: string
        status: 'ACTIVE' | 'DISABLED' | 'PENDING'
        role: string | null
        roleId: string | null
        id: string
        store: string
    }[]
}

export default function ShowEmployees({ employees }: ShowEmployeesProps) {
    const createEmployeeDialogRef = useRef<CreateEmployeeDialogHandles>(null)

    return (
        <>
            <table className="mt-4 w-full table-auto">
                <thead>
                    <tr className="border-b border-t border-zinc-800">
                        <th className="py-2 text-left text-base font-semibold text-zinc-400">
                            Nome
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Cargo
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Status
                        </th>
                        <th className="py-2 text-end text-base font-semibold text-zinc-400">
                            Editar
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {React.Children.toArray(
                        employees.map(employee => (
                            <tr className="group">
                                <td className="py-2 text-sm text-zinc-300 group-last:pb-0">
                                    {employee.name}
                                </td>
                                <td className="py-2 text-center text-sm text-zinc-300 group-last:pb-0">
                                    {employee.role ?? '---'}
                                </td>
                                <td className="py-2 text-center text-sm text-zinc-300 group-last:pb-0">
                                    {employee.status === 'ACTIVE' && 'Ativo'}
                                    {employee.status === 'DISABLED' &&
                                        'Inativo'}
                                    {employee.status === 'PENDING' &&
                                        'Pendente'}
                                </td>
                                <td className="py-2 pr-4 text-end text-sm text-zinc-300 group-last:pb-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            createEmployeeDialogRef.current?.edit(
                                                employee
                                            )
                                        }
                                    >
                                        <FaPencilAlt />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <CreateEmployeeDialog ref={createEmployeeDialogRef} />
        </>
    )
}
