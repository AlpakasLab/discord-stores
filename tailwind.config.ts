import type { Config } from 'tailwindcss'
import DefaultTheme from 'tailwindcss/defaultTheme'
import TailwindForms from '@tailwindcss/forms'
import HeadlessUi from '@headlessui/tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        container: {
            center: true,
            padding: '1.5rem'
        },
        fontFamily: {
            inter: ['var(--font-inter)', ...DefaultTheme.fontFamily.sans]
        }
    },
    plugins: [HeadlessUi, TailwindForms]
}

export default config
