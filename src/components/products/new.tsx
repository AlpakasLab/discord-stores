'use client'

import { useRef } from 'react'
import Button from '../inputs/button'
import CreateProductDialog, { CreateProductDialogHandles } from './create'
import { useParams } from 'next/navigation'
import { useStoreContext } from '../store/context'

export default function NewProduct() {
    const params = useParams()
    const createProductDialogRef = useRef<CreateProductDialogHandles>(null)
    const { themed, isManager } = useStoreContext()

    if (!isManager) return null

    return (
        <>
            <Button
                component="button"
                type="button"
                text="Cadastrar"
                size="sm"
                color={themed ? 'custom-secondary' : 'secondary'}
                onClick={() =>
                    createProductDialogRef.current?.open(params.id.toString())
                }
            />
            <CreateProductDialog ref={createProductDialogRef} />
        </>
    )
}
