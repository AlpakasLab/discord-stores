'use client'

import { useRouter } from 'next/navigation'
import Button from '../inputs/button'
import TextInput from '../inputs/text'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { InsertTagData, InsertTagSchema } from '@/entities/tag'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { Dialog } from '@headlessui/react'
import { useStoreContext } from '../store/context'
import tinycolor from 'tinycolor2'

type TagsConfigurationProps = {
    tags: { id: string; name: string; color: string | null }[]
    store: string
}

export default function TagsConfiguration({
    tags,
    store
}: TagsConfigurationProps) {
    const { themed } = useStoreContext()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<InsertTagData>({
        resolver: zodResolver(InsertTagSchema),
        defaultValues: {
            storeId: store
        }
    })

    const [creating, setCreating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [idToDelete, setIdToDelete] = useState<string | null>(null)

    const deleteTag = async () => {
        setDeleting(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/tag?id=${idToDelete}`,
                {
                    method: 'DELETE'
                }
            )

            if (!response.ok) {
                setDeleting(false)
                toast.error('Não foi possível deletar a tag :(')
            } else {
                toast.success('Tag deletada com sucesso!')
                setDeleting(false)
                setOpenDeleteDialog(false)
                setIdToDelete(null)
                router.refresh()
            }
        } catch (e) {
            toast.error('Não foi possível deletar a tag :(')
        }
    }

    const createTag = async (data: InsertTagData) => {
        setCreating(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/tag`,
                {
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            )

            if (!response.ok) {
                setCreating(false)
                toast.error('Não foi possível registrar a tag :(')
            } else {
                reset()
                setCreating(false)
                router.refresh()
            }
        } catch (e) {
            toast.error('Não foi possível registrar a tag :(')
        }
    }

    return (
        <>
            <div className="mt-2 flex w-full flex-wrap items-start justify-start gap-2">
                {React.Children.toArray(
                    tags.map(tag => (
                        <div
                            style={
                                tag.color
                                    ? {
                                          backgroundColor: tag.color,
                                          color: tinycolor(tag.color).isDark()
                                              ? '#FFF'
                                              : '#18181b'
                                      }
                                    : undefined
                            }
                            className="flex w-fit items-center gap-x-1 rounded-md bg-zinc-500 px-2 py-1 text-sm text-slate-200 odd:bg-zinc-700"
                        >
                            <p>{tag.name}</p>
                            <button
                                onClick={() => {
                                    setOpenDeleteDialog(true)
                                    setIdToDelete(tag.id)
                                }}
                                type="button"
                                className="ml-1 text-sm"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))
                )}
            </div>
            <form
                onSubmit={handleSubmit(createTag)}
                className="mt-4 flex items-start gap-x-2 border-t border-zinc-800 pt-2"
            >
                <TextInput
                    {...register('name')}
                    label="Nome:"
                    type="text"
                    autoComplete="none"
                    error={errors.name?.message}
                    placeholder="Esgotado, Especial, Mais Vendido..."
                />
                <div className="w-28">
                    <TextInput
                        {...register('color')}
                        label="Cor:"
                        type="color"
                        autoComplete="none"
                        placeholder=""
                        error={errors.color?.message}
                    />
                </div>
                <div className="mt-7 max-w-[10rem]">
                    <Button
                        disabled={isSubmitting || creating}
                        component="button"
                        type="submit"
                        color={themed ? 'custom-secondary' : 'secondary'}
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
                            Deletar Tag
                        </Dialog.Title>
                        <Dialog.Description className="text-center text-base text-zinc-400">
                            Remover uma Tag também as remove dos produtos onde
                            elas se encontram. Se você tem certeza que deseja
                            excluir, prossiga com a ação.
                        </Dialog.Description>
                        {deleting ? (
                            <p className="mt-8 w-full text-center text-zinc-200">
                                <FaSpinner className="mr-2 inline animate-spin" />{' '}
                                Removendo Tag...
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
                                        deleteTag()
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
