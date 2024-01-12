import { z } from 'zod'

export const StoreSchema = z.object({
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
        .uuid('Digite um código válido')
        .nonempty('Campo obrigatório')
})

export const StoreColorsSchema = z.object({
    id: z.string({
        required_error: 'Campo obrigatório',
        invalid_type_error: 'ID inválido'
    }),
    primaryColor: z
        .string({ invalid_type_error: 'Digite uma cor válida' })
        .regex(/#[0-9a-fA-F]{6}/, 'A cor precisa ser em hexadecimal')
        .optional(),
    secondaryColor: z
        .string({ invalid_type_error: 'Digite uma cor válida' })
        .regex(/#[0-9a-fA-F]{6}/, 'A cor precisa ser em hexadecimal')
        .optional()
})

export type StoreData = z.infer<typeof StoreSchema>
export type StoreColorsData = z.infer<typeof StoreColorsSchema>
export type RequestEntryData = z.infer<typeof RequestEntrySchema>
