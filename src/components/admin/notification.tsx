'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import SelectInput from '../inputs/select'
import TextInput from '../inputs/text'
import MessageInput from '../inputs/mensagem'
import Button from '../inputs/button'
import { NotificationData, NotificationSchema } from '@/entities/notification'
import { useState } from 'react'
import toast from 'react-hot-toast'

type NotificationFormProps = {
    admins: { id: string; name: string }[]
}

export default function NotificationForm({ admins }: NotificationFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        resetField,
        formState: { errors, isSubmitting }
    } = useForm<NotificationData>({
        resolver: zodResolver(NotificationSchema)
    })

    const [sending, setSending] = useState(false)

    const sendNotification = async (data: NotificationData) => {
        setSending(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/notification/`,
                {
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            )

            setSending(false)

            if (!response.ok) {
                toast.error('Não foi possível enviar a notificação :(')
            } else {
                toast.success('Notificação enviada com sucesso!')
                reset()
            }
        } catch (e) {
            toast.error('Não foi possível enviar a notificação :(')
        }
    }

    return (
        <form
            onSubmit={handleSubmit(sendNotification)}
            className="flex w-full max-w-md flex-col gap-y-4"
        >
            <TextInput
                {...register('icon')}
                label="Ícon:"
                type="text"
                autoComplete="none"
                error={errors.icon?.message}
            />
            <TextInput
                {...register('title')}
                label="Título:"
                type="text"
                autoComplete="none"
                error={errors.title?.message}
            />
            <SelectInput
                mode="multi"
                label="Usuário:"
                options={admins.map(admin => ({
                    label: admin.name,
                    value: admin.id
                }))}
                onSelectOption={option => {
                    if (option) {
                        setValue(
                            'users',
                            option
                                .filter(value => value.value !== null)
                                .map(value => value.value.toString()),
                            {
                                shouldValidate: true
                            }
                        )
                    } else {
                        resetField('users', {
                            keepError: false
                        })
                    }
                }}
                error={errors.users?.message}
            />
            <MessageInput
                {...register('description')}
                label="Descrição:"
                autoComplete="none"
                maxLength={255}
                error={errors.description?.message}
            />
            <Button
                disabled={isSubmitting || sending}
                component="button"
                type="submit"
                text="Enviar"
                size="sm"
                color="primary"
            />
        </form>
    )
}
