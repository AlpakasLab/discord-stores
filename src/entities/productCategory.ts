import { z } from 'zod'

export const ProductCategorySchema = z.object({
    id: z
        .string({
            invalid_type_error: 'ID inválido'
        })
        .optional(),
    name: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um nome válido'
        })
        .nonempty('Campo obrigatório'),
    order: z.coerce
        .number({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um valor válido'
        })
        .min(0)
        .optional(),
    storeId: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma loja válida'
        })
        .nonempty('Campo obrigatório')
})

export type ProductCategoryData = z.infer<typeof ProductCategorySchema>
