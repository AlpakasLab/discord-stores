'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useImperativeHandle } from 'react'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import TextInput from '../inputs/text'
import { useRouter } from 'next/navigation'
import Button from '../inputs/button'
import SelectInput from '../inputs/select'
import { FaSpinner } from 'react-icons/fa'
import { useStoreContext } from '../store/context'
import { ItemData, ItemSchema } from '@/entities/item'
import toast from 'react-hot-toast'

export type CreateItemDialogHandles = {
    open: (storeId: string) => void
    edit: (item: {
        id: string
        name: string
        image: string | null
        category: string
        store: string
    }) => void
}

const CreateItemDialog = React.forwardRef<CreateItemDialogHandles>((_, ref) => {
    const { themed } = useStoreContext()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        resetField,
        formState: { errors, isSubmitting }
    } = useForm<ItemData>({
        resolver: zodResolver(ItemSchema)
    })

    const [categories, setCategories] = useState<
        null | { label: string; value: string }[]
    >(null)
    const [creating, setCreating] = useState(false)
    const [storeId, setStoreId] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [itemId, setItemId] = useState<string | null>(null)
    const [loadedInitialData, setLoadedInitialData] = useState(false)

    const [categoryDefaultValue, setCategoryDefaultValue] = useState<
        null | string
    >(null)

    const [dialogData, setDialogData] = useState<{
        opened: boolean
    }>({
        opened: false
    })

    const saveItem = async (data: ItemData) => {
        setCreating(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/item/`,
                {
                    method: isEditing ? 'PUT' : 'POST',
                    body: JSON.stringify(data)
                }
            )

            setCreating(false)

            if (!response.ok) {
                toast.error('Não foi possível salvar o item :(')
            } else {
                toast.success('Item salvo com sucesso!')
                reset()
                router.refresh()
                setIsEditing(false)
                setItemId(null)
                setCategoryDefaultValue(null)
                setLoadedInitialData(false)
                setDialogData({ opened: false })
            }
        } catch (e) {
            toast.error('Não foi possível salvar o item :(')
        }
    }

    useImperativeHandle(ref, () => {
        return {
            open(storeId) {
                setDialogData({
                    opened: true
                })
                setIsEditing(false)
                setStoreId(storeId)
                setValue('store', storeId)
            },
            edit(item) {
                setDialogData({
                    opened: true
                })
                setIsEditing(true)
                setStoreId(item.store)
                setValue('store', item.store)
                setValue('name', item.name)
                if (item.image) setValue('image', item.image)
                setValue('id', item.id)
                setItemId(item.id)
                setLoadedInitialData(false)
            }
        }
    })

    useEffect(() => {
        if (storeId && categories === null) {
            const url = new URL(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/product/category/`
            )
            url.searchParams.append('id', storeId)

            fetch(url)
                .then(response => response.json())
                .then(
                    (response: {
                        data: {
                            name: string
                            id: string
                        }[]
                    }) =>
                        setCategories(
                            response.data.map(item => ({
                                label: item.name,
                                value: item.id
                            }))
                        )
                )
                .catch(() => {
                    setCategories([])
                })
        }
    }, [categories, storeId])

    useEffect(() => {
        if (storeId && itemId !== null && loadedInitialData === false) {
            const url = new URL(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/item/`
            )
            url.searchParams.append('id', itemId)

            fetch(url)
                .then(response => response.json())
                .then(
                    (response: {
                        data: {
                            category: string
                            id: string
                        }
                    }) => {
                        setCategoryDefaultValue(response.data.category)
                        setValue('category', response.data.category)
                        setLoadedInitialData(true)
                    }
                )
                .catch(() => {
                    setLoadedInitialData(true)
                })
        }
    }, [loadedInitialData, itemId, setValue, storeId])

    return (
        <Dialog
            open={dialogData.opened}
            onClose={() => {
                setDialogData({
                    opened: false
                })
                setIsEditing(false)
                setItemId(null)
                setCategoryDefaultValue(null)
                setLoadedInitialData(false)
            }}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="flex w-full max-w-xl flex-col items-center rounded bg-zinc-800 p-5 text-white">
                    <Dialog.Title className="mb-5 text-xl font-semibold">
                        {isEditing ? 'Editando Produto' : 'Novo produto'}
                    </Dialog.Title>

                    {categories === null ? (
                        <div className="py-5">
                            <p className="flex animate-pulse items-center justify-center gap-x-2 text-sm">
                                <FaSpinner className="animate-spin text-base" />
                                Carregando Informações
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit(saveItem)}
                            className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5"
                        >
                            <TextInput
                                {...register('name')}
                                label="Nome:"
                                type="text"
                                autoComplete="none"
                                placeholder="Hamburguer"
                                error={errors.name?.message}
                            />
                            <SelectInput
                                mode="single"
                                label="Categoria:"
                                defaultOption={categoryDefaultValue}
                                options={categories}
                                onSelectOption={option => {
                                    if (option) {
                                        setValue(
                                            'category',
                                            option.value.toString(),
                                            {
                                                shouldValidate: true
                                            }
                                        )
                                    } else {
                                        resetField('category', {
                                            keepError: false
                                        })
                                    }
                                }}
                                error={errors.category?.message}
                            />
                            <TextInput
                                {...register('image')}
                                label="Imagem:"
                                type="url"
                                autoComplete="none"
                                placeholder="https://i.imgur.com/......jpeg"
                                error={errors.image?.message}
                            />
                            <div className="col-span-full flex items-center justify-center">
                                <Button
                                    disabled={isSubmitting || creating}
                                    component="button"
                                    type="submit"
                                    text={creating ? 'Salvando...' : 'Salvar'}
                                    size="sm"
                                    color={
                                        themed ? 'custom-primary' : 'primary'
                                    }
                                />
                            </div>
                        </form>
                    )}
                </Dialog.Panel>
            </div>
        </Dialog>
    )
})

CreateItemDialog.displayName = 'CreateItemDialog'
export default CreateItemDialog
