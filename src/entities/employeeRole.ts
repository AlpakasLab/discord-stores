import { z } from 'zod'

export const EmployeeRoleSchema = z.object({
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
    comission: z.coerce
        .number({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um valor válido'
        })
        .min(0)
        .max(100),
    manager: z
        .boolean({
            invalid_type_error: 'O valor precisa ser booleano'
        })
        .optional()
})

export type EmployeeRoleData = z.infer<typeof EmployeeRoleSchema>
