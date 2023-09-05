'use client'

import { useRef } from 'react'
import Button from '../inputs/button'
import CreateProductDialog, { CreateProductDialogHandles } from './create'
import { useParams } from 'next/navigation'

export default function NewProduct() {
    const params = useParams()
    const createProductDialogRef = useRef<CreateProductDialogHandles>(null)

    return (
        <>
            <Button
                component="button"
                type="button"
                text="Cadastrar"
                size="sm"
                color="secondary"
                onClick={() =>
                    createProductDialogRef.current?.open(params.id.toString())
                }
            />
            <CreateProductDialog ref={createProductDialogRef} />
        </>
    )
}
