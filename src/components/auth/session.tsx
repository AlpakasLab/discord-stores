'use client'

import { toast } from 'react-hot-toast'

type VerifySessionErrorProps = {
    sessionError?: string
}

export default function VerifySessionError({
    sessionError
}: VerifySessionErrorProps) {
    if (sessionError) {
        toast.error(
            'Sua sessão está com problemas, por favor tente entrar novamente!'
        )
    }

    return <></>
}
