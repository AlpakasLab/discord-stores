import { z } from 'zod'

export const OrderCreateSchema = z.object({
    client: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um nome válido'
        })
        .nonempty('Campo obrigatório'),
    store: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma loja válida'
        })
        .nonempty('Campo obrigatório'),
    discount: z.preprocess(
        val => {
            if (typeof val === 'string') {
                if (val.trim().length <= 0) {
                    return null
                }
                return Number(val)
            }
            return val
        },
        z
            .number({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Digite um valor válido'
            })
            .min(0)
            .max(100)
            .nullable()
    ),
    delivery: z.preprocess(
        val => {
            if (typeof val === 'string') {
                if (val.trim().length <= 0) {
                    return null
                }
                return Number(val)
            }

            if (val === undefined) {
                return null
            }

            return val
        },
        z
            .number({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Digite um valor válido'
            })
            .min(0)
            .nullable()
    )
})

export type OrderItem = {
    id: string
    name: string
    unitPrice: number
    quantity: number
}

export type OrderCreateData = z.infer<typeof OrderCreateSchema>
