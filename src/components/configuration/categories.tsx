'use client'

import { useRouter } from 'next/navigation'
import Button from '../inputs/button'
import TextInput from '../inputs/text'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    InsertProductCategoryData,
    InsertProductCategorySchema
} from '@/entities/productCategory'
import React, { useState } from 'react'

type CategoriesConfigurationProps = {
    categories: { id: string; name: string }[]
    store: string
}

export default function CategoriesConfiguration({
    categories,
    store
}: CategoriesConfigurationProps) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<InsertProductCategoryData>({
        resolver: zodResolver(InsertProductCategorySchema),
        defaultValues: {
            storeId: store
        }
    })

    const [creating, setCreating] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const createCategory = async (data: InsertProductCategoryData) => {
        setResult(null)
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
                setResult('Não foi possível registrar a categoria :(')
            } else {
                reset()
                setCreating(false)
                router.refresh()
            }
        } catch (e) {
            setResult('Não foi possível registrar a categoria :(')
        }
    }

    return (
        <>
            <div className="mt-2 flex w-full flex-wrap items-start justify-start gap-2">
                {React.Children.toArray(
                    categories.map(category => (
                        <div className="w-fit rounded-md bg-slate-500 px-2 py-1 text-sm text-slate-200 odd:bg-slate-700">
                            {category.name}
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
                <div className="mt-7 max-w-[10rem]">
                    <Button
                        disabled={isSubmitting || creating}
                        component="button"
                        type="submit"
                        color="secondary"
                        size="sm"
                        text={creating ? 'Salvando' : 'Criar'}
                    />
                </div>
            </form>

            {result && (
                <p className="w-full pt-1 text-center text-xs text-red-700">
                    {result}
                </p>
            )}
        </>
    )
}
