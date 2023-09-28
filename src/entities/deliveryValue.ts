import { z } from 'zod'

export const DeliveryValueSchema = z.object({
    id: z
        .string({
            invalid_type_error: 'ID inválido'
        })
        .optional(),
    description: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite uma descrição válida'
        })
        .nonempty('Campo obrigatório')
        .max(255, 'Máximo de 255 caracteres'),
    value: z.preprocess(
        val => {
            if (typeof val === 'string') {
                if (val.trim().length <= 0) {
                    return undefined
                }
                return Number(val)
            }
            return val
        },
        z
            .number({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Digite um valor válido'
            })
            .min(0)
    ),
    store: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma loja válida'
        })
        .nonempty('Campo obrigatório')
})

export type DeliveryValueData = z.infer<typeof DeliveryValueSchema>
