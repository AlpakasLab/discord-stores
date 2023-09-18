'use client'

import React, { useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import Button from '../inputs/button'
import { FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useStoreContext } from '../store/context'

export type DeleteProductDialogHandles = {
    open: (product: { id: string; name: string }) => void
}

const DeleteProductDialog = React.forwardRef<DeleteProductDialogHandles>(
    (_, ref) => {
        const router = useRouter()

        const [dialogData, setDialogData] = useState<{
            opened: boolean
        }>({
            opened: false
        })

        const [deleting, setDeleting] = useState(false)
        const [productData, setProductData] = useState<{
            id: string
            name: string
        } | null>(null)

        useImperativeHandle(ref, () => {
            return {
                open(product) {
                    setDialogData({
                        opened: true
                    })
                    setProductData(product)
                }
            }
        })

        const deleteProduct = async () => {
            if (!productData) return
            setDeleting(true)

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/product?id=${productData.id}`,
                    {
                        method: 'DELETE'
                    }
                )

                if (!response.ok) {
                    setDeleting(false)
                    toast.error('Não foi possível deletar o produto :(')
                } else {
                    toast.success('Produto deletado com sucesso!')
                    setDeleting(false)
                    setDialogData({
                        opened: false
                    })
                    setProductData(null)
                    router.refresh()
                }
            } catch (e) {
                toast.error('Não foi possível deletar o produto :(')
            }
        }

        return (
            <Dialog
                open={dialogData.opened}
                onClose={() => {
                    setDialogData({
                        opened: false
                    })
                    setProductData(null)
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex w-full max-w-xl flex-col items-center rounded bg-zinc-800 p-5 text-white">
                        <Dialog.Title className="mb-5 text-xl font-semibold">
                            Deletar Produto
                        </Dialog.Title>
                        {productData && (
                            <Dialog.Description className="text-center text-base text-zinc-400">
                                Você tem certeza que deseja deletar&nbsp;
                                <strong className="font-semibold">
                                    {productData.name}
                                </strong>
                                ? Se sim, prossiga com a ação.
                            </Dialog.Description>
                        )}
                        {deleting ? (
                            <p className="mt-8 w-full text-center text-zinc-200">
                                <FaSpinner className="mr-2 inline animate-spin" />{' '}
                                Removendo Produto...
                            </p>
                        ) : (
                            <div className="mt-8 flex w-full items-center gap-x-4">
                                <Button
                                    component="button"
                                    type="button"
                                    text="Cancelar"
                                    color="success"
                                    size="sm"
                                    onClick={() => {
                                        setDialogData({
                                            opened: false
                                        })
                                        setProductData(null)
                                    }}
                                />
                                <Button
                                    component="button"
                                    type="button"
                                    text="Prosseguir"
                                    color="neutral"
                                    size="sm"
                                    onClick={() => {
                                        deleteProduct()
                                    }}
                                />
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    }
)

DeleteProductDialog.displayName = 'DeleteProductDialog'
export default DeleteProductDialog
