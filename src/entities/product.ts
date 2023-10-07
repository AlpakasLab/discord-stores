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
                        return null
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
                .nullable()
        ),
        employeeComission: z.preprocess(
            val => {
                if (typeof val === 'string') {
                    if (val.trim().length <= 0) {
                        return null
                    }
                    return Number(val)
                }
                return val
            },
            z
                .number({
                    required_error: 'Campo obrigatório',
                    invalid_type_error: 'Digite uma comissão válida'
                })
                .min(0)
                .nullable()
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
            if (
                data.promotionalPrice === undefined ||
                data.promotionalPrice === null
            )
                return true
            return Number(data.promotionalPrice) < Number(data.price)
        },
        {
            message:
                'O valor promocional precisa ser menor que o preço original',
            path: ['promotionalPrice']
        }
    )
    .refine(
        data => {
            if (
                data.employeeComission === undefined ||
                data.employeeComission === null
            )
                return true
            if (
                data.promotionalPrice !== undefined &&
                data.promotionalPrice !== null
            )
                return (
                    Number(data.employeeComission) <=
                    Number(data.promotionalPrice)
                )
            return Number(data.employeeComission) <= Number(data.price)
        },
        {
            message:
                'O valor de comissão precisa ser menor ou igual ao preço do produto',
            path: ['employeeComission']
        }
    )

export type ProductData = z.infer<typeof ProductSchema>
