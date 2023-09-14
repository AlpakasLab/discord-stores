'use client'

import { useRef } from 'react'
import { useParams } from 'next/navigation'
import Button from '@/components/inputs/button'
import CreateEmployeeRoleDialog, {
    CreateEmployeeRoleDialogHandles
} from './create'
import { useStoreContext } from '@/components/store/context'

export default function NewEmployeeRole() {
    const { themed } = useStoreContext()
    const params = useParams()
    const createEmployeeRoleDialogRef =
        useRef<CreateEmployeeRoleDialogHandles>(null)

    return (
        <>
            <Button
                component="button"
                type="button"
                text="Cadastrar"
                size="sm"
                color={themed ? 'custom-secondary' : 'secondary'}
                onClick={() =>
                    createEmployeeRoleDialogRef.current?.open(
                        params.id.toString()
                    )
                }
            />
            <CreateEmployeeRoleDialog ref={createEmployeeRoleDialogRef} />
        </>
    )
}
