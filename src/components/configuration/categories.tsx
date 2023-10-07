'use client'

import { useRouter } from 'next/navigation'
import Button from '../inputs/button'
import TextInput from '../inputs/text'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    ProductCategoryData,
    ProductCategorySchema
} from '@/entities/productCategory'
import React, { useState } from 'react'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import { Dialog } from '@headlessui/react'
import toast from 'react-hot-toast'
import { useStoreContext } from '../store/context'

type CategoriesConfigurationProps = {
    categories: { id: string; name: string; order: number }[]
    store: string
}

export default function CategoriesConfiguration({
    categories,
    store
}: CategoriesConfigurationProps) {
    const { themed } = useStoreContext()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ProductCategoryData>({
        resolver: zodResolver(ProductCategorySchema),
        defaultValues: {
            storeId: store
        }
    })

    const [creating, setCreating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [idToDelete, setIdToDelete] = useState<string | null>(null)

    const deleteCategory = async () => {
        setDeleting(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/product/category?id=${idToDelete}`,
                {
                    method: 'DELETE'
                }
            )

            if (response.status === 403) {
                setDeleting(false)
                toast.error('Existem produtos utilizando esta categoria :(')
            } else if (!response.ok) {
                setDeleting(false)
                toast.error('Não foi possível deletar a categoria :(')
            } else {
                toast.success('Categoria deletada com sucesso!')
                setDeleting(false)
                setOpenDeleteDialog(false)
                setIdToDelete(null)
                router.refresh()
            }
        } catch (e) {
            toast.error('Não foi possível deletar a categoria :(')
        }
    }

    const createCategory = async (data: ProductCategoryData) => {
        setCreating(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/product/category`,
                {
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            )

            if (!response.ok) {
                setCreating(false)
                toast.error('Não foi possível registrar a categoria :(')
            } else {
                reset()
                setCreating(false)
                router.refresh()
            }
        } catch (e) {
            toast.error('Não foi possível registrar a categoria :(')
        }
    }

    return (
        <>
            <div className="mt-2 flex w-full flex-grow flex-wrap content-start items-start justify-start gap-2">
                {React.Children.toArray(
                    categories.map(category => (
                        <div className="flex w-fit items-center gap-x-1 rounded-md bg-zinc-500 px-2 py-1 text-sm text-slate-200 odd:bg-zinc-700">
                            <p>
                                {category.order > 0 && (
                                    <span>{category.order} |</span>
                                )}{' '}
                                {category.name}
                            </p>
                            <button
                                onClick={() => {
                                    setOpenDeleteDialog(true)
                                    setIdToDelete(category.id)
                                }}
                                type="button"
                                className="ml-1 text-sm text-red-400"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))
                )}
            </div>
            <form
                onSubmit={handleSubmit(createCategory)}
                className="mt-4 flex items-start gap-x-2 border-t border-zinc-800 pt-2"
            >
                <TextInput
                    {...register('name')}
                    label="Nome:"
                    type="text"
                    autoComplete="none"
                    error={errors.name?.message}
                    placeholder="Comidas, Bebidas, Doces..."
                />
                <div className="w-28">
                    <TextInput
                        {...register('order')}
                        label="Ordem:"
                        type="number"
                        autoComplete="none"
                        error={errors.order?.message}
                        placeholder="0"
                    />
                </div>
                <div className="mt-7 max-w-[10rem]">
                    <Button
                        disabled={isSubmitting || creating}
                        component="button"
                        type="submit"
                        color={themed ? 'custom-primary' : 'secondary'}
                        size="sm"
                        text={creating ? 'Salvando' : 'Criar'}
                    />
                </div>
            </form>
            <Dialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false)
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="flex w-full max-w-xl flex-col items-center rounded bg-zinc-800 p-5 text-white">
                        <Dialog.Title className="mb-5 text-xl font-semibold">
                            Deletar Categoria
                        </Dialog.Title>
                        <Dialog.Description className="text-center text-base text-zinc-400">
                            Para uma categoria ser removida com sucesso ela deve
                            ser primeiro removida de todos os produtos que ela
                            faz parte. Se você já fez isso prossiga com a ação
                            de deletar.
                        </Dialog.Description>
                        {deleting ? (
                            <p className="mt-8 w-full text-center text-zinc-200">
                                <FaSpinner className="mr-2 inline animate-spin" />{' '}
                                Removendo Categoria...
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
                                        setOpenDeleteDialog(false)
                                    }}
                                />
                                <Button
                                    component="button"
                                    type="button"
                                    text="Prosseguir"
                                    color="neutral"
                                    size="sm"
                                    onClick={() => {
                                        deleteCategory()
                                    }}
                                />
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    )
}
