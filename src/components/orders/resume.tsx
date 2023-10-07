'use client'

import React, { useMemo, useState } from 'react'
import { useSellContext } from './context'
import { numberToMoney } from '@/utils/formatter'
import { FaShoppingBasket, FaTrashAlt } from 'react-icons/fa'
import Button from '../inputs/button'
import TextInput from '../inputs/text'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderCreateData, OrderCreateSchema } from '@/entities/order'
import toast from 'react-hot-toast'
import CheckboxInput from '../inputs/checkbox'
import { useStoreContext } from '../store/context'
import { useRouter } from 'next/navigation'
import SelectInput from '../inputs/select'
import { getItemsPriceAndComissions } from '@/utils/calculate'

type OrderResumeProps = {
    deliveryValues: {
        id: string
        description: string
        value: number
    }[]
    enableOrder: boolean
    storeId: string
}

export default function OrderResume({
    enableOrder,
    deliveryValues,
    storeId
}: OrderResumeProps) {
    const { themed, comission } = useStoreContext()
    const router = useRouter()

    const { items, dispatchSell } = useSellContext()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        resetField,
        watch,
        formState: { errors }
    } = useForm<OrderCreateData>({
        resolver: zodResolver(OrderCreateSchema),
        defaultValues: {
            store: storeId
        }
    })

    const [result, setResult] = useState<null | string>(null)
    const [saving, setSaving] = useState(false)
    const [isDelivery, setIsDelivery] = useState(false)
    const [opened, setOpened] = useState(false)

    const discountValue = watch('discount')
    const deliveryValue = watch('delivery')

    const storeComission = useMemo(() => {
        if (!comission) return null

        const { storeComission } = getItemsPriceAndComissions(
            items,
            discountValue,
            comission
        )

        return storeComission
    }, [comission, discountValue, items])

    const { itemsTotal, discountTotal, total } = useMemo(() => {
        let itemsTotal = 0

        items.forEach(item => {
            itemsTotal += item.quantity * item.unitPrice
        })

        let discountTotal = undefined

        let total = itemsTotal

        if (discountValue) {
            discountTotal = Math.round((total / 100) * discountValue)
            total = total - discountTotal
        }

        if (deliveryValue !== undefined && deliveryValue !== null) {
            total += deliveryValue
        }

        return { itemsTotal, discountTotal, total }
    }, [deliveryValue, discountValue, items])

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
                setIsDelivery(false)
                router.refresh()
            }
        } catch (e) {
            setResult('Não foi possível realizar o pedido :(')
        }
    }

    return (
        <aside
            data-opened={opened}
            className="fixed bottom-0 left-0 h-fit w-full flex-shrink-0 overflow-y-auto shadow-lg data-[opened=true]:max-h-[80vh] md:sticky md:bottom-auto md:left-auto md:top-0 md:h-fit md:w-80 md:overflow-y-visible md:pl-2 md:pt-5 md:shadow-none md:data-[opened=true]:max-h-none lg:w-96 lg:pl-5"
        >
            {!enableOrder ? (
                <div className="flex w-full flex-col items-center rounded-t-md bg-zinc-800 p-4 md:rounded-b-md">
                    <p className="text-center text-sm text-zinc-600">
                        As configurações necessárias para realizar vendas ainda
                        não foram preenchidas.
                    </p>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit(saveOrder)}
                    className="flex h-auto w-full flex-col items-center rounded-t-md bg-zinc-800 p-4 md:h-fit md:rounded-b-md"
                >
                    <header
                        onClick={() => {
                            setOpened(old => !old)
                        }}
                        role="button"
                        className="flex w-full items-center justify-between md:justify-center"
                    >
                        <p className="flex items-center gap-x-2 text-base font-semibold text-green-500 sm:text-lg md:hidden">
                            <FaShoppingBasket /> {items.length}
                        </p>
                        <p className="text-xl font-bold">Venda</p>
                        <p className="flex items-center gap-x-2 text-base font-semibold text-green-500 sm:text-lg md:hidden">
                            {numberToMoney(total)}
                        </p>
                    </header>
                    <table
                        data-opened={opened}
                        className="mb-4 mt-5 hidden w-full table-auto data-[opened=true]:table md:table"
                    >
                        <thead>
                            <tr className="border-b border-t border-zinc-800">
                                <th className="py-1 text-left text-sm font-semibold text-zinc-400 lg:text-base">
                                    Qtd.
                                </th>
                                <th className="py-1 text-left text-sm font-semibold text-zinc-400 lg:text-base">
                                    Produto
                                </th>
                                <th className="py-1 text-sm font-semibold text-zinc-400 lg:text-base">
                                    Total
                                </th>
                                <th className="py-1 text-end text-sm font-semibold text-zinc-400 lg:text-base">
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
                                        <td className="py-1 text-left text-sm lg:text-base">
                                            {item.quantity}
                                        </td>
                                        <td className="py-1 text-left text-sm lg:text-base">
                                            {item.name}
                                        </td>
                                        <td className="py-1 text-center text-sm text-zinc-200 lg:text-base">
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
                    {items.length > 0 && (
                        <div
                            data-opened={opened}
                            className="mb-4 hidden w-full flex-col items-stretch gap-y-2 border-y border-zinc-700 py-2 data-[opened=true]:flex md:flex md:data-[opened=true]:flex"
                        >
                            <div className="flex w-full items-center justify-between">
                                <p>Items</p>
                                <p className="text-zinc-200">
                                    {numberToMoney(itemsTotal)}
                                </p>
                            </div>
                            {discountTotal !== undefined && (
                                <div className="flex w-full items-center justify-between">
                                    <p>Desconto</p>
                                    <p className="text-red-500">
                                        - {numberToMoney(discountTotal)}
                                    </p>
                                </div>
                            )}
                            {deliveryValue !== undefined &&
                                deliveryValue !== null && (
                                    <div className="flex w-full items-center justify-between">
                                        <p>Taxa de Entrega</p>
                                        <p className="text-green-600">
                                            + {numberToMoney(deliveryValue)}
                                        </p>
                                    </div>
                                )}
                            <div className="flex w-full items-center justify-between">
                                <p className="text-lg font-semibold">
                                    Total Cliente
                                </p>
                                <p className="text-green-500">
                                    {numberToMoney(total)}
                                </p>
                            </div>
                            {storeComission !== null && (
                                <div className="flex w-full items-center justify-between border-t border-zinc-700 pb-2 pt-4">
                                    <p className="text-base text-zinc-300">
                                        Comissão da Loja
                                    </p>
                                    <p className="text-zinc-300">
                                        {numberToMoney(storeComission)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    <div
                        data-enabled={items.length > 0}
                        data-opened={opened}
                        className="hidden w-full flex-col items-stretch gap-y-5 opacity-50 data-[opened=true]:flex data-[enabled=true]:opacity-100 md:flex md:data-[opened=true]:flex"
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
                        <CheckboxInput
                            className={
                                themed ? 'text-custom-primary' : undefined
                            }
                            checked={isDelivery}
                            onChange={e => {
                                setIsDelivery(e.target.checked)
                            }}
                        >
                            Possuí taxa de entrega?
                        </CheckboxInput>
                        {isDelivery && (
                            <SelectInput
                                mode="single"
                                label="Taxa de entrega:"
                                defaultOption={-1}
                                options={[
                                    {
                                        label: 'Selecione um Valor',
                                        value: -1,
                                        disabled: true
                                    },
                                    ...deliveryValues.map(deliveryValue => ({
                                        label: deliveryValue.description,
                                        value: deliveryValue.value
                                    }))
                                ]}
                                onSelectOption={option => {
                                    if (option) {
                                        setValue(
                                            'delivery',
                                            Number(option.value),
                                            {
                                                shouldValidate: true
                                            }
                                        )
                                    } else {
                                        resetField('delivery', {
                                            keepError: false
                                        })
                                    }
                                }}
                                error={errors.delivery?.message}
                            />
                        )}
                        <Button
                            disabled={saving || items.length <= 0}
                            component="button"
                            type="submit"
                            size="sm"
                            color={themed ? 'custom-primary' : 'primary'}
                            text="Finalizar Venda"
                        />
                        {result && (
                            <p className="col-span-full w-full pt-1 text-center text-xs text-red-700">
                                {result}
                            </p>
                        )}
                    </div>
                </form>
            )}
        </aside>
    )
}
