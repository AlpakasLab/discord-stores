'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import TextInput from '../inputs/text'
import Button from '../inputs/button'
import { useStoreContext } from '../store/context'

const FiltersSchema = z.object({
    startDate: z.coerce
        .date({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Entre com uma data válida'
        })
        .nullable(),
    endDate: z.coerce
        .date({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Entre com uma data válida'
        })
        .nullable()
})

type FiltersData = z.infer<typeof FiltersSchema>

export default function OrdersFilters() {
    const { themed } = useStoreContext()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FiltersData>({
        resolver: zodResolver(FiltersSchema)
    })

    const filterOrders = (data: FiltersData) => {
        console.log(data)
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
