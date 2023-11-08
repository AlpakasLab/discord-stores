import { getAnalyticsData } from '@/services/admin'
import { Metadata } from 'next'
import React from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: 'Administração'
}

export default async function Admin() {
    const data = await getAnalyticsData()

    return (
        <div className="container relative grid h-full w-full flex-grow grid-cols-3 py-5">
            <div className="grid w-full grid-cols-3 gap-3">
                <p className="col-span-full pb-4 text-lg font-semibold">
                    Lojas
                </p>
                {React.Children.toArray(
                    data.stores.map(store => (
                        <div
                            data-disabled={!store.active}
                            className="rounded-md border border-zinc-700 p-4 data-[disabled=true]:opacity-50"
                        >
                            <div className="flex items-center gap-x-2">
                                {store.primaryColor && (
                                    <div
                                        className="h-1.5 w-6 rounded-md"
                                        style={{
                                            backgroundColor: store.primaryColor
                                        }}
                                    />
                                )}
                                {store.secondaryColor && (
                                    <div
                                        className="h-1.5 w-6 rounded-md"
                                        style={{
                                            backgroundColor:
                                                store.secondaryColor
                                        }}
                                    />
                                )}
                            </div>
                            <p className="mt-2 text-base">{store.name}</p>
                            <p className="text-sm text-zinc-400">
                                {store.owner ?? '----'}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
