import { z } from 'zod'

export const ProductSchema = z
    .object({
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
        price: z.preprocess(
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
                    invalid_type_error: 'Digite um preço válido'
                })
                .min(0)
        ),
        promotionalPrice: z.preprocess(
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
                    invalid_type_error: 'Digite um preço válido'
                })
                .min(0)
                .optional()
        ),
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
            .optional(),
        active: z
            .boolean({
                invalid_type_error: 'O valor precisa ser booleano'
            })
            .optional()
    })
    .refine(
        data => {
            if (data.promotionalPrice === undefined) return true
            return Number(data.promotionalPrice) < Number(data.price)
        },
        {
            message:
                'O valor promocional precisa ser menor que o preço original',
            path: ['promotionalPrice']
        }
    )

export type ProductData = z.infer<typeof ProductSchema>
