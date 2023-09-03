'use client'

import { signIn } from 'next-auth/react'
import Button from '../inputs/button'

export default function Signin() {
    return (
        <Button
            component="button"
            type="button"
            onClick={() => signIn('discord', { callbackUrl: '/stores/' })}
            text="Entrar"
        />
    )
}
