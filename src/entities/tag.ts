import { z } from 'zod'

export const InsertTagSchema = z.object({
    name: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um nome válido'
        })
        .nonempty('Campo obrigatório'),
    color: z
        .string({ invalid_type_error: 'Digite uma cor válida' })
        .regex(/#[0-9a-fA-F]{6}/, 'A cor precisa ser em hexadecimal')
        .optional(),
    storeId: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma loja válida'
        })
        .nonempty('Campo obrigatório')
})

export type InsertTagData = z.infer<typeof InsertTagSchema>
