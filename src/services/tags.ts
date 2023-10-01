import { db } from '@/providers/database/client'
import { tags } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'

export async function getTags(store: string) {
    try {
        const tagsRegistred = await db
            .select({
                name: tags.name,
                id: tags.id,
                color: tags.color
            })
            .from(tags)
            .where(eq(tags.storeId, store))

        return tagsRegistred
    } catch (error) {
        throw new Error('Cannot get tags')
    }
}
