import { z } from 'zod'

export const InsertProductSchema = z.object({
    name: z
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
    description: z
        .string({
            invalid_type_error: 'Digite uma descrição válida'
        })
        .optional(),
    price: z.coerce
        .number({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um preço válido'
        })
        .min(0),
    image: z.preprocess(
        val => (String(val).length <= 0 ? undefined : val),
        z
            .string({
                invalid_type_error: 'Digite um endereço válido'
            })
            .nonempty('Campo obrigatório')
            .url('Digite uma url válida')
            .regex(/i\.imgur\.com/, 'A url deve conter i.imgur.com')
            .optional()
    ),
    category: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma categoria válida'
        })
        .nonempty('Campo obrigatório'),
    tags: z
        .string({
            invalid_type_error: 'Escolha uma tag válida'
        })
        .array()
        .optional()
})

export type InsertProductData = z.infer<typeof InsertProductSchema>
