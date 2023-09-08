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
    discount: z.coerce
        .number({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um valor válido'
        })
        .min(0)
        .max(100)
        .optional()
})

export type OrderCreateData = z.infer<typeof OrderCreateSchema>
