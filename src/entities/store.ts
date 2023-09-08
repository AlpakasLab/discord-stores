import { z } from 'zod'

export const InsertStoreSchema = z.object({
    name: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um nome válido'
        })
        .nonempty('Campo obrigatório'),
    ownerName: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um nome válido'
        })
        .nonempty('Campo obrigatório'),
    comission: z.coerce
        .number({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um valor válido'
        })
        .min(0)
        .max(100),
    server: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha um servidor válido'
        })
        .nonempty('Campo obrigatório')
})

export const RequestEntrySchema = z.object({
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
export type RequestEntryData = z.infer<typeof RequestEntrySchema>
