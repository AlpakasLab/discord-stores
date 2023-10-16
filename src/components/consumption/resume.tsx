'use client'

import React, { useState } from 'react'
import { FaShoppingBasket, FaTrashAlt } from 'react-icons/fa'
import Button from '../inputs/button'
import toast from 'react-hot-toast'
import { useStoreContext } from '../store/context'
import { useRouter } from 'next/navigation'
import { useSellContext } from '../orders/context'
import Link from 'next/link'

type OrderResumeProps = {
    storeId: string
}

export default function OrderResume({ storeId }: OrderResumeProps) {
    const { themed } = useStoreContext()
    const router = useRouter()

    const { items, dispatchSell } = useSellContext()

    const [saving, setSaving] = useState(false)
    const [opened, setOpened] = useState(false)

    const saveConsumption = async () => {
        setSaving(true)

        try {
            const data = { items: items, storeId: storeId }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/consumption/`,
                {
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            )

            setSaving(false)

            if (!response.ok) {
                toast.error('Não foi possível salvar o consumo :(')
            } else {
                dispatchSell('RESET')
                toast.success('Consumo Registrado!')
                router.refresh()
            }
        } catch (e) {
            toast.error('Não foi possível salvar o consumo :(')
        }
    }

    return (
        <aside
            data-opened={opened}
            className="fixed bottom-0 left-0 h-fit w-full flex-shrink-0 overflow-y-auto shadow-lg data-[opened=true]:max-h-[80vh] md:sticky md:bottom-auto md:left-auto md:top-0 md:h-fit md:w-80 md:overflow-y-visible md:pl-2 md:pt-5 md:shadow-none md:data-[opened=true]:max-h-none lg:w-96 lg:pl-5"
        >
            <div className="flex h-auto w-full flex-col items-center rounded-t-md bg-zinc-800 p-4 md:h-fit md:rounded-b-md">
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
                    <p className="text-xl font-bold">Consumo</p>
                    <p className="flex items-center gap-x-2 text-base font-semibold text-green-500 sm:text-lg md:hidden"></p>
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
                    data-opened={opened}
                    className="hidden w-full flex-col items-stretch gap-y-3 opacity-50 data-[opened=true]:flex data-[enabled=true]:opacity-100 md:flex md:data-[opened=true]:flex"
                >
                    <Button
                        disabled={saving || items.length <= 0}
                        onClick={() => saveConsumption()}
                        component="button"
                        type="button"
                        size="sm"
                        color={themed ? 'custom-primary' : 'primary'}
                        text="Salvar"
                    />
                    <p className="w-full text-justify text-xs text-zinc-500">
                        O consumo de items do estabelecimento deve seguir as
                        regras já estabelecidas na contratação. Ao clicar em
                        salvar, uma mensagem será encaminhada diretamente para o
                        discord da loja.&nbsp;
                        <strong className="font-semibold underline">
                            Para registros de vendas utilizar a página de&nbsp;
                            <Link
                                href={`/stores/${storeId}/`}
                                className="text-zinc-300"
                            >
                                Produtos
                            </Link>
                            .
                        </strong>
                    </p>
                </div>
            </div>
        </aside>
    )
}
