'use client'

import { signOut } from 'next-auth/react'
import { FaSignOutAlt } from 'react-icons/fa'
export default function Signout() {
    return (
        <button
            type="button"
            title="Sair"
            onClick={() => {
                signOut()
            }}
        >
            <FaSignOutAlt className="text-lg text-red-800" />
        </button>
    )
}
