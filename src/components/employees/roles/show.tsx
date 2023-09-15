'use client'

import React, { useRef } from 'react'
import { FaPencilAlt, FaWrench } from 'react-icons/fa'
import CreateEmployeeRoleDialog, {
    CreateEmployeeRoleDialogHandles
} from './create'

type ShowEmployeeRolesProps = {
    roles: {
        name: string
        comission: number
        manager: boolean
        id: string
        store: string
    }[]
    isAdmin: boolean
}

export default function ShowEmployeeRoles({
    roles,
    isAdmin
}: ShowEmployeeRolesProps) {
    const createEmployeeRoleDialogRef =
        useRef<CreateEmployeeRoleDialogHandles>(null)

    return (
        <>
            <table className="mt-4 w-full table-auto">
                <thead>
                    <tr className="border-b border-t border-zinc-800">
                        <th className="py-2 text-left text-base font-semibold text-zinc-400">
                            Nome
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Comissão
                        </th>
                        <th className="py-2 text-end text-base font-semibold text-zinc-400">
                            Editar
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {React.Children.toArray(
                        roles.map(role => (
                            <tr className="group">
                                <td className="py-2 text-sm text-zinc-300 group-last:pb-0">
                                    {role.name}{' '}
                                    {role.manager && (
                                        <FaWrench className="ml-1 inline" />
                                    )}
                                </td>
                                <td className="py-2 text-center text-sm text-zinc-300 group-last:pb-0">
                                    {role.comission}%
                                </td>
                                <td className="py-2 pr-4 text-end text-sm text-zinc-300 group-last:pb-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            createEmployeeRoleDialogRef.current?.edit(
                                                role
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
            <CreateEmployeeRoleDialog ref={createEmployeeRoleDialogRef} />
        </>
    )
}
