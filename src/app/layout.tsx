import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
    title: {
        default: 'Discord Store',
        template: '%s | Discord Store'
    },
    robots: { index: false, follow: false }
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br" className={inter.className}>
            <body className="flex h-full min-h-screen w-full scroll-smooth bg-zinc-900 font-inter text-white">
                <main className="flex h-full w-full flex-grow flex-col items-center">
                    {children}
                </main>
                <Toaster
                    toastOptions={{
                        style: {
                            backgroundColor: '#d4d4d8'
                        }
                    }}
                />
            </body>
        </html>
    )
}
