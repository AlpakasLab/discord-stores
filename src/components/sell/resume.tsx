'use client'

import React, { useState } from 'react'
import { useSellContext } from './context'
import { numberToMoney } from '@/utils/formatter'
import { FaTrashAlt } from 'react-icons/fa'
import Button from '../inputs/button'
import TextInput from '../inputs/text'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderCreateData, OrderCreateSchema } from '@/entities/order'
import toast from 'react-hot-toast'

type OrderResumeProps = {
    enableOrder: boolean
    storeId: string
}

export default function OrderResume({
    enableOrder,
    storeId
}: OrderResumeProps) {
    const { items, dispatchSell } = useSellContext()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<OrderCreateData>({
        resolver: zodResolver(OrderCreateSchema),
        defaultValues: {
            store: storeId
        }
    })

    const [result, setResult] = useState<null | string>(null)
    const [saving, setSaving] = useState(false)

    const saveOrder = async (data: OrderCreateData) => {
        setResult(null)
        setSaving(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/order/`,
                {
                    method: 'POST',
                    body: JSON.stringify({ ...data, items: items })
                }
            )

            setSaving(false)

            if (!response.ok) {
                setResult('Não foi possível realizar o pedido :(')
            } else {
                reset()
                dispatchSell('RESET')
                toast.success('Venda Registrada!')
            }
        } catch (e) {
            setResult('Não foi possível realizar o pedido :(')
        }
    }

    if (!enableOrder) {
        return (
            <div className="flex w-full flex-col items-center rounded-md bg-zinc-800 p-4">
                <p className="text-center text-sm text-zinc-600">
                    As configurações necessárias para realizar vendas ainda não
                    foram preenchidas.
                </p>
            </div>
        )
    }

    return (
        <form
            onSubmit={handleSubmit(saveOrder)}
            className="flex w-full flex-col items-center rounded-md bg-zinc-800 p-4"
        >
            <p className="text-xl font-bold">Venda</p>
            <table className="mb-5 mt-5 w-full table-auto">
                <thead>
                    <tr className="border-b border-t border-zinc-800">
                        <th className="py-1 text-left font-semibold text-zinc-400">
                            Qtd.
                        </th>
                        <th className="py-1 text-left font-semibold text-zinc-400">
                            Produto
                        </th>
                        <th className="py-1 font-semibold text-zinc-400">
                            Total
                        </th>
                        <th className="py-1 text-end font-semibold text-zinc-400">
                            Excluir
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.length <= 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="py-5 text-center text-sm text-zinc-500"
                            >
                                <p>Selecione alguns produtos</p>
                            </td>
                        </tr>
                    )}
                    {React.Children.toArray(
                        items.map(item => (
                            <tr className="group">
                                <td className="py-1 text-left">
                                    {item.quantity}
                                </td>
                                <td className="py-1 text-left">{item.name}</td>
                                <td className="py-1 text-center text-green-500">
                                    {numberToMoney(
                                        item.quantity * item.unitPrice
                                    )}
                                </td>
                                <td className="py-1 pr-5 text-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatchSell('REMOVE', item)
                                        }
                                        className="text-sm text-zinc-500"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div
                data-enabled={items.length > 0}
                className="flex w-full flex-col items-stretch gap-y-5 opacity-50 data-[enabled=true]:opacity-100"
            >
                <TextInput
                    {...register('client')}
                    label="Nome do Cliente:"
                    type="text"
                    autoComplete="none"
                    placeholder="Nome Sobrenome"
                    error={errors.client?.message}
                />
                <TextInput
                    {...register('discount')}
                    label="Porcentagem de Desconto:"
                    type="number"
                    autoComplete="none"
                    placeholder="50%"
                    max={100}
                    min={0}
                    error={errors.discount?.message}
                />
                <Button
                    disabled={saving || items.length <= 0}
                    component="button"
                    type="submit"
                    size="sm"
                    color="success"
                    text="Finalizar Venda"
                />
                {result && (
                    <p className="col-span-full w-full pt-1 text-center text-xs text-red-700">
                        {result}
                    </p>
                )}
            </div>
        </form>
    )
}
