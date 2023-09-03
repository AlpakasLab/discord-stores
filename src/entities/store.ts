import { z } from 'zod'

const InsertStoreSchema = z.object({
    name: z
        .string({
            required_error: 'Campo obrigatório',
            invalid_type_error: 'Digite um nome válido'
        })
        .nonempty('Campo obrigatório')
})

type InsertStoreData = z.infer<typeof InsertStoreSchema>

export { InsertStoreSchema }
export type { InsertStoreData }
