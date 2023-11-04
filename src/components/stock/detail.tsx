'use client'

import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import Button from '../inputs/button'
import { FaPencilAlt } from 'react-icons/fa'
import { useStoreContext } from '../store/context'

export type ItemDetailDialogHandles = {
    open: (item: { name: string; category: string; id: string }) => void
}

type ItemDetailDialogProps = {
    onEditClick: (id: string) => void
    onDeleteClick: (id: string) => void
}

const ItemDetailDialog = React.forwardRef<
    ItemDetailDialogHandles,
    ItemDetailDialogProps
>(({ onEditClick, onDeleteClick }, ref) => {
    const { themed, isManager } = useStoreContext()

    const [dialogData, setDialogData] = useState<{
        opened: boolean
        item: null | {
            name: string
            category: string
            id: string
        }
    }>({
        opened: false,
        item: null
    })

    useImperativeHandle(ref, () => {
        return {
            open(item) {
                setDialogData({
                    opened: true,
                    item
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
                    item: null
                })
            }}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative flex w-full max-w-lg flex-col items-center rounded bg-zinc-800 p-5 text-white">
                    {dialogData.item && (
                        <>
                            {isManager && (
                                <button
                                    onClick={() => {
                                        if (dialogData.item)
                                            onEditClick(dialogData.item.id)
                                        setDialogData({
                                            opened: false,
                                            item: null
                                        })
                                    }}
                                    type="button"
                                    className="absolute right-5 top-5"
                                >
                                    <FaPencilAlt />
                                </button>
                            )}

                            <Dialog.Title className="mb-5 text-xl font-semibold">
                                {dialogData.item.name}
                            </Dialog.Title>

                            <div className="mb-5 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                                <div className=" w-full text-left text-zinc-200">
                                    <p className="font-semibold text-zinc-600">
                                        Categoria
                                    </p>
                                    {dialogData.item.category}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="flex w-full items-center gap-5">
                        {isManager && (
                            <Button
                                component="button"
                                onClick={() => {
                                    if (dialogData.item)
                                        onDeleteClick(dialogData.item.id)
                                    setDialogData({
                                        opened: false,
                                        item: null
                                    })
                                }}
                                color="neutral"
                                type="button"
                                text="Remover"
                            />
                        )}
                        <Button
                            component="button"
                            onClick={() => {
                                setDialogData({
                                    opened: false,
                                    item: null
                                })
                            }}
                            color={themed ? 'custom-secondary' : 'secondary'}
                            type="button"
                            text="OK"
                        />
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
})

ItemDetailDialog.displayName = 'ItemDetailDialog'
export default ItemDetailDialog
