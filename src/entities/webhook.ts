import { z } from 'zod'

export const WebHookSchema = z.object({
    sell: z.preprocess(
        val => {
            if (typeof val === 'string' && val.length <= 0) {
                return undefined
            }

            return val
        },
        z
            .string({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Digite uma url válida'
            })
            .url('Digite uma url válida')
            .regex(/discord\.com/, 'A url deve conter discord.com')
            .optional()
    ),
    logs: z.preprocess(
        val => {
            if (typeof val === 'string' && val.length <= 0) {
                return undefined
            }

            return val
        },
        z
            .string({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Digite uma url válida'
            })
            .url('Digite uma url válida')
            .regex(/discord\.com/, 'A url deve conter discord.com')
            .optional()
    ),
    consumption: z.preprocess(
        val => {
            if (typeof val === 'string' && val.length <= 0) {
                return undefined
            }

            return val
        },
        z
            .string({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Digite uma url válida'
            })
            .url('Digite uma url válida')
            .regex(/discord\.com/, 'A url deve conter discord.com')
            .optional()
    ),
    stock: z.preprocess(
        val => {
            if (typeof val === 'string' && val.length <= 0) {
                return undefined
            }

            return val
        },
        z
            .string({
                required_error: 'Campo obrigatório',
                invalid_type_error: 'Digite uma url válida'
            })
            .url('Digite uma url válida')
            .regex(/discord\.com/, 'A url deve conter discord.com')
            .optional()
    ),
    storeId: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha uma loja válida'
        })
        .min(1, 'Campo obrigatório')
})

export const TempleateWebHookSchema = z.object({
    id: z.string({
        required_error: 'Campo obrigatório',
        invalid_type_error: 'ID inválido'
    }),
    title: z
        .string({
            invalid_type_error: 'Digite um título válido'
        })
        .optional(),
    color: z
        .string({ invalid_type_error: 'Digite uma cor válida' })
        .regex(/#[0-9a-fA-F]{6}/, 'A cor precisa ser em hexadecimal')
        .optional(),
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
    fields: z
        .object({
            title: z
                .string({
                    required_error: 'Campo obrigatório',
                    invalid_type_error: 'Digite um título válido'
                })
                .nonempty('Campo obrigatório'),
            value: z
                .string({
                    required_error: 'Campo obrigatório',
                    invalid_type_error: 'Digite um valor válido'
                })
                .nonempty('Campo obrigatório'),
            inline: z
                .boolean({
                    invalid_type_error: 'Escolha uma opção válida'
                })
                .optional()
        })
        .array()
})

export type InsertWebHookData = z.infer<typeof WebHookSchema>
export type TempleateWebhookData = z.infer<typeof TempleateWebHookSchema>
