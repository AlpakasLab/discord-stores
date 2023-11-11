'use client'

import React, { useRef } from 'react'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import CreateEmployeeDialog, { CreateEmployeeDialogHandles } from './create'
import DeleteEmployeeDialog, { DeleteEmployeeDialogHandles } from './delete'

type ShowEmployeesProps = {
    employees: {
        name: string
        status: 'ACTIVE' | 'DISABLED' | 'PENDING'
        role: string | null
        roleId: string | null
        id: string
        user: string
        store: string
    }[]
    userId: string
}

export default function ShowEmployees({
    employees,
    userId
}: ShowEmployeesProps) {
    const createEmployeeDialogRef = useRef<CreateEmployeeDialogHandles>(null)
    const deleteEmployeeDialogRef = useRef<DeleteEmployeeDialogHandles>(null)

    return (
        <>
            <table className="mt-4 w-full table-auto">
                <thead>
                    <tr className="border-b border-t border-zinc-800">
                        <th className="px-1 py-2 text-left text-base font-semibold text-zinc-400">
                            Nome
                        </th>
                        <th className="px-1 py-2 text-base font-semibold text-zinc-400">
                            Cargo
                        </th>
                        <th className="px-1 py-2 text-base font-semibold text-zinc-400">
                            Status
                        </th>
                        <th className="px-1 py-2 text-base font-semibold text-zinc-400">
                            Editar
                        </th>
                        <th className="px-1 py-2 text-end text-base font-semibold text-zinc-400">
                            Deletar
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {React.Children.toArray(
                        employees.map(employee => (
                            <tr
                                data-pending={employee.status === 'PENDING'}
                                className="group data-[pending=true]:bg-yellow-500/20"
                            >
                                <td className="px-1 py-2 text-sm text-zinc-300">
                                    {employee.name}
                                </td>
                                <td className="px-1  py-2 text-center text-sm text-zinc-300">
                                    {employee.role ?? '---'}
                                </td>
                                <td className="px-1  py-2 text-center text-sm text-zinc-300">
                                    {employee.status === 'ACTIVE' && 'Ativo'}
                                    {employee.status === 'DISABLED' &&
                                        'Inativo'}
                                    {employee.status === 'PENDING' &&
                                        'Pendente'}
                                </td>
                                <td className="px-1 py-2 text-center text-sm text-zinc-300">
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
                                <td className="py-2 pl-1 pr-2 text-end text-sm text-zinc-300">
                                    <button
                                        className="disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={
                                            employee.role === 'Proprietário' ||
                                            employee.user === userId
                                        }
                                        type="button"
                                        onClick={() =>
                                            deleteEmployeeDialogRef.current?.open(
                                                employee
                                            )
                                        }
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <CreateEmployeeDialog ref={createEmployeeDialogRef} />
            <DeleteEmployeeDialog ref={deleteEmployeeDialogRef} />
        </>
    )
}
