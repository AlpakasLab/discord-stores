import { z } from 'zod'

export const InsertTagSchema = z.object({
    name: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um nome válido'
        })
        .nonempty('Campo obrigatório'),
    storeId: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma loja válida'
        })
        .nonempty('Campo obrigatório')
})

export type InsertTagData = z.infer<typeof InsertTagSchema>
