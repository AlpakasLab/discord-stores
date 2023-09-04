import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Button from '@/components/inputs/button'
import TextInput from '@/components/inputs/text'
import { getServerSession } from 'next-auth'

export default async function StoreDetail() {
    const session = await getServerSession(authOptions)

    return (
        <div className="container relative mt-5 flex h-full w-full flex-grow flex-row items-stretch justify-stretch divide-x divide-zinc-700">
            <div className="h-full w-full flex-grow pr-5">
                <header className="flex w-full items-center justify-between pb-5">
                    <p className="text-xl font-bold">Produtos (0)</p>
                    <div className="flex items-center gap-x-5">
                        <TextInput
                            type="text"
                            placeholder="Pesquisar Produto"
                        />
                        {session && session.user.role === 'ADMIN' && (
                            <Button
                                component="button"
                                type="button"
                                text="Cadastrar"
                                size="sm"
                                color="secondary"
                            />
                        )}
                    </div>
                </header>
            </div>
            <aside className="h-full w-96 flex-shrink-0 pl-5"></aside>
        </div>
    )
}
