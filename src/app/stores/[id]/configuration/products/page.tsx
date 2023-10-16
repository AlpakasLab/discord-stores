import CategoriesConfiguration from '@/components/configuration/categories'
import TagsConfiguration from '@/components/configuration/tags'
import { getProductCategories, getTags } from '@/services/configuration'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Configurações'
}

export default async function Configuration({
    params
}: {
    params: { id: string }
}) {
    const categories = await getProductCategories(params.id)
    const tags = await getTags(params.id)

    return (
        <div className="relative grid h-full w-full flex-grow grid-cols-1 place-content-stretch gap-5 md:grid-cols-2">
            <div className="flex h-full flex-col rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">
                    Categorias ({categories.length})
                </p>
                <CategoriesConfiguration
                    categories={categories}
                    store={params.id}
                />
            </div>
            <div className="flex h-full flex-col rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">Tags ({tags.length})</p>
                <TagsConfiguration tags={tags} store={params.id} />
            </div>
        </div>
    )
}
