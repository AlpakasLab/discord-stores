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
        },
        extend: {
            colors: {
                custom: {
                    primary: 'rgb(var(--color-primary) / <alpha-value>)',
                    primaryHover:
                        'rgb(var(--color-primary-hover) / <alpha-value>)',
                    primaryText:
                        'rgb(var(--color-primary-text) / <alpha-value>)',
                    secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                    secondaryHover:
                        'rgb(var(--color-secondary-hover) / <alpha-value>)',
                    secondaryText:
                        'rgb(var(--color-secondary-text) / <alpha-value>)'
                }
            }
        }
    },
    plugins: [HeadlessUi, TailwindForms]
}

export default config
