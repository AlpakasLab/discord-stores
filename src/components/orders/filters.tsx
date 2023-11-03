'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import TextInput from '../inputs/text'
import Button from '../inputs/button'
import { useStoreContext } from '../store/context'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import toast from 'react-hot-toast'

const FiltersSchema = z.object({
    startDate: z.preprocess(
        val => {
            if (typeof val === 'string' && val.length <= 0) {
                return undefined
            }
            return val
        },
        z.coerce
            .date({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Entre com uma data válida'
            })
            .optional()
    ),
    endDate: z.preprocess(
        val => {
            if (typeof val === 'string' && val.length <= 0) {
                return undefined
            }
            return val
        },
        z.coerce
            .date({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Entre com uma data válida'
            })
            .optional()
    ),
    client: z.preprocess(
        val => {
            if (typeof val === 'string' && val.length <= 0) {
                return undefined
            }
            return val
        },
        z
            .string({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Digite um nome válido'
            })
            .trim()
            .optional()
    )
})

type FiltersData = z.infer<typeof FiltersSchema>

export default function OrdersFilters() {
    const router = useRouter()
    const { themed } = useStoreContext()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FiltersData>({
        resolver: zodResolver(FiltersSchema)
    })

    const filterOrders = (data: FiltersData) => {
        const params = new URLSearchParams({})

        if (data.startDate) {
            const startDate = moment(data.startDate).utc(false).toISOString()
            params.append('start', startDate)
        }

        if (data.endDate) {
            const endDate = moment(data.endDate).utc(false).toISOString()
            params.append('end', endDate)
        }

        if (data.client) params.append('client', data.client)

        if (params.size > 0) {
            router.replace(`?${params.toString()}`)
        } else {
            toast.error('Você não selecionou nenhum filtro!')
        }
    }

    return (
        <form
            onSubmit={handleSubmit(filterOrders)}
            className="flex items-start gap-5"
        >
            <div className="w-56">
                <TextInput
                    {...register('startDate')}
                    label="Período Inicial:"
                    type="date"
                    autoComplete="none"
                    error={errors.startDate?.message}
                />
            </div>
            <div className="w-56">
                <TextInput
                    {...register('endDate')}
                    label="Período Final:"
                    type="date"
                    autoComplete="none"
                    error={errors.endDate?.message}
                />
            </div>
            <div className="w-56">
                <TextInput
                    {...register('client')}
                    label="Cliente:"
                    type="text"
                    autoComplete="none"
                    placeholder="Nome Sobrenome"
                    error={errors.client?.message}
                />
            </div>
            <div className="mt-7 w-28">
                <Button
                    disabled={isSubmitting}
                    component="button"
                    type="submit"
                    color={themed ? 'custom-primary' : 'secondary'}
                    size="sm"
                    text={'Filtrar'}
                />
            </div>
        </form>
    )
}
