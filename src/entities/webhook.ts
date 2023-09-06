import { z } from 'zod'

export const InsertWebHookSchema = z.object({
    sell: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite uma url válida'
        })
        .url('Digite uma url válida')
        .regex(/discord\.com/, 'A url deve conter discord.com')
        .optional(),
    logs: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite uma url válida'
        })
        .url('Digite uma url válida')
        .regex(/discord\.com/, 'A url deve conter discord.com')
        .optional(),
    storeId: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma loja válida'
        })
        .nonempty('Campo obrigatório')
})

export type InsertWebHookData = z.infer<typeof InsertWebHookSchema>
