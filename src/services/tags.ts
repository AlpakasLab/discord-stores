import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { db } from '@/providers/database/client'
import { tags } from '@/providers/database/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'

export async function getTagsColors(store: string) {
    const session = await getServerSession(authOptions)
    if (
        !session ||
        !session.user ||
        !session.user.discord ||
        !session.user.role
    )
        throw new Error('User not authenticated')

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
