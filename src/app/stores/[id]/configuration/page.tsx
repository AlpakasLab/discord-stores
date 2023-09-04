import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import CategoriesConfiguration from '@/components/configuration/categories'
import TagsConfiguration from '@/components/configuration/tags'
import { getProductCategories, getTags } from '@/services/configuration'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Configuration({
    params
}: {
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)
    const categories = await getProductCategories(params.id)
    const tags = await getTags(params.id)

    if (!session || (session && session.user.role !== 'ADMIN')) {
        redirect('/')
    }

    return (
        <div className="container relative mt-5 grid h-full w-full flex-grow grid-cols-3 place-content-start gap-5">
            <div className="h-fit rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">
                    Categorias ({categories.length})
                </p>
                <CategoriesConfiguration
                    categories={categories}
                    store={params.id}
                />
            </div>
            <div className="h-fit rounded-md border border-zinc-700 p-4">
                <p className="font-semibold">Tags ({tags.length})</p>
                <TagsConfiguration tags={tags} store={params.id} />
            </div>
        </div>
    )
}
