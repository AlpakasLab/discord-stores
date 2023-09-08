'use client'

import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import Button from '../inputs/button'
import { numberToMoney } from '@/utils/formatter'
import { FaPencilAlt } from 'react-icons/fa'

export type ProductDetailDialogHandles = {
    open: (product: {
        name: string
        description: string | null
        price: number
        category: string
        tags: string
        id: string
    }) => void
}

type ProductDetailDialogProps = {
    isAdmin: boolean
    onEditClick: (id: string) => void
}

const ProductDetailDialog = React.forwardRef<
    ProductDetailDialogHandles,
    ProductDetailDialogProps
>(({ isAdmin, onEditClick }, ref) => {
    const [dialogData, setDialogData] = useState<{
        opened: boolean
        product: null | {
            name: string
            description: string | null
            price: number
            category: string
            tags: string
            id: string
        }
    }>({
        opened: false,
        product: null
    })

    useImperativeHandle(ref, () => {
        return {
            open(product) {
                setDialogData({
                    opened: true,
                    product
                })
            }
        }
    })

    return (
        <Dialog
            open={dialogData.opened}
            onClose={() => {
                setDialogData({
                    opened: false,
                    product: null
                })
            }}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative flex w-full max-w-md flex-col items-center rounded bg-zinc-800 p-5 text-white">
                    {dialogData.product && (
                        <>
                            {isAdmin && (
                                <button
                                    onClick={() => {
                                        if (dialogData.product)
                                            onEditClick(dialogData.product.id)
                                        setDialogData({
                                            opened: false,
                                            product: null
                                        })
                                    }}
                                    type="button"
                                    className="absolute right-5 top-5"
                                >
                                    <FaPencilAlt />
                                </button>
                            )}

                            <Dialog.Title className="mb-5 text-xl font-semibold">
                                {dialogData.product.name}
                            </Dialog.Title>

                            <div className="mb-5 grid w-full grid-cols-2 gap-2">
                                {
                                    <div className="col-span-full w-full text-left text-zinc-200">
                                        <p className="font-semibold text-zinc-600">
                                            Descrição
                                        </p>
                                        {dialogData.product.description ||
                                            'Sem Descrição'}
                                    </div>
                                }
                                <div className=" w-full text-left text-zinc-200">
                                    <p className="font-semibold text-zinc-600">
                                        Preço
                                    </p>
                                    {numberToMoney(dialogData.product.price)}
                                </div>
                                <div className=" w-full text-left text-zinc-200">
                                    <p className="font-semibold text-zinc-600">
                                        Categoria
                                    </p>
                                    {dialogData.product.category}
                                </div>
                            </div>
                        </>
                    )}
                    <Button
                        component="button"
                        onClick={() => {
                            setDialogData({
                                opened: false,
                                product: null
                            })
                        }}
                        type="button"
                        text="OK"
                    />
                </Dialog.Panel>
            </div>
        </Dialog>
    )
})

ProductDetailDialog.displayName = 'ProductDetailDialog'
export default ProductDetailDialog
