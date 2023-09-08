import { z } from 'zod'

export const EmployeeSchema = z.object({
    id: z.string({
        required_error: 'Campo obrigatório',
        invalid_type_error: 'ID inválido'
    }),
    name: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um nome válido'
        })
        .nonempty('Campo obrigatório'),
    status: z.enum(['ACTIVE', 'DISABLED', 'PENDING'], {
        required_error: 'Campo obrigatório'
    }),
    role: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Escolha um cargo válido'
        })
        .optional()
})

export type EmployeeData = z.infer<typeof EmployeeSchema>
