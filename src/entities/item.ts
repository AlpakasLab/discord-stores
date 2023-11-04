import { z } from 'zod'

export const ItemSchema = z.object({
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
        .min(3, 'Digite no mínimo 3 caracteres'),
    store: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma loja válida'
        })
        .min(3, 'Digite no mínimo 3 caracteres'),
    image: z.preprocess(
        val => (String(val).length <= 0 ? undefined : val),
        z
            .string({
                invalid_type_error: 'Digite um endereço válido'
            })
            .min(3, 'Digite no mínimo 3 caracteres')
            .url('Digite uma url válida')
            .regex(/i\.imgur\.com/, 'A url deve conter i.imgur.com')
            .optional()
    ),
    category: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma categoria válida'
        })
        .min(3, 'Digite no mínimo 3 caracteres')
})

export const StockSaveSchema = z.object({
    store: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma loja válida'
        })
        .min(3, 'Digite no mínimo 3 caracteres')
})

export type StockItem = {
    id: string
    name: string
    quantity: number
}

export type ItemData = z.infer<typeof ItemSchema>
export type StockSaveData = z.infer<typeof StockSaveSchema>
