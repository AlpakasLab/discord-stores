import { z } from 'zod'

export const InsertStoreSchema = z.object({
    name: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um nome válido'
        })
        .nonempty('Campo obrigatório'),
    server: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha um servidor válido'
        })
        .nonempty('Campo obrigatório')
})

export type InsertStoreData = z.infer<typeof InsertStoreSchema>
