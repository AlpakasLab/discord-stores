'use client'

import React, { useRef } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { numberToMoney } from '@/utils/formatter'
import Button from '@/components/inputs/button'
import { useStoreContext } from '@/components/store/context'
import CreateDeliveryValuesDialog, {
    CreateDeliveryValuesDialogHandles
} from './create'

type DeliveryValuesConfigurationProps = {
    values: {
        id: string
        description: string
        value: number
    }[]
    store: string
}

export default function DeliveryValuesConfiguration({
    values,
    store
}: DeliveryValuesConfigurationProps) {
    const { themed } = useStoreContext()
    const createDeliveryValuesDialogRef =
        useRef<CreateDeliveryValuesDialogHandles>(null)

    return (
        <>
            <div className="flex w-full items-center justify-between">
                <p className="font-semibold">Valores de Entrega</p>
                <div className="max-w-xs">
                    <Button
                        component="button"
                        type="button"
                        text="Cadastrar"
                        size="sm"
                        color={themed ? 'custom-secondary' : 'secondary'}
                        onClick={() =>
                            createDeliveryValuesDialogRef.current?.open(store)
                        }
                    />
                </div>
            </div>
            <table className="mt-4 w-full table-auto">
                <thead>
                    <tr className="border-b border-t border-zinc-800">
                        <th className="py-2 text-left text-base font-semibold text-zinc-400">
                            Descrição
                        </th>
                        <th className="py-2 text-base font-semibold text-zinc-400">
                            Valor
                        </th>
                        <th className="py-2 text-end text-base font-semibold text-zinc-400">
                            Editar
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {React.Children.toArray(
                        values.map(value => (
                            <tr className="group">
                                <td className="py-2 text-sm text-zinc-300 group-last:pb-0">
                                    {value.description}
                                </td>
                                <td className="py-2 text-center text-sm text-zinc-300 group-last:pb-0">
                                    {numberToMoney(value.value)}
                                </td>
                                <td className="py-2 pr-4 text-end text-sm text-zinc-300 group-last:pb-0">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            createDeliveryValuesDialogRef.current?.edit(
                                                store,
                                                value
                                            )
                                        }}
                                    >
                                        <FaPencilAlt />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <CreateDeliveryValuesDialog ref={createDeliveryValuesDialogRef} />
        </>
    )
}
