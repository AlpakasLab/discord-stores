import Link from 'next/link'
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonStyles = tv({
    base: 'font-semibold w-full rounded-md transition-all duration-300 disabled:grayscale disabled:cursor-not-allowed',
    variants: {
        color: {
            primary: 'bg-cyan-500 text-white hover:bg-cyan-700',
            secondary: 'bg-emerald-500 text-white hover:bg-emerald-700',
            success: 'bg-green-500 text-white hover:bg-green-700',
            neutral: 'bg-zinc-500 text-white hover:bg-zinc-700',
            'custom-primary':
                'bg-custom-primary text-custom-primaryText hover:bg-custom-primaryHover',
            'custom-secondary':
                'bg-custom-secondary text-custom-secondaryText hover:bg-custom-secondaryHover'
        },
        size: {
            md: 'py-2 px-5 text-lg',
            sm: 'py-2 px-4 text-base'
        }
    },
    defaultVariants: {
        color: 'primary',
        size: 'md'
    }
})

type ButtonVariants = VariantProps<typeof buttonStyles>

type BaseProps = {
    text: string
    customColors?: {
        primary: string
        primaryHover: string
        secondary: string
        secondaryHover: string
    }
} & ButtonVariants

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    component: 'link'
} & BaseProps

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    component: 'button'
} & BaseProps

type Props = LinkProps | ButtonProps

export default function Button(props: Props) {
    if (props.component === 'link') {
        return (
            <Link
                className={buttonStyles({
                    color: props.color,
                    size: props.size
                })}
                href={props.href ?? '#'}
                {...props}
            >
                {props.text}
            </Link>
        )
    } else {
        return (
            <button
                type="button"
                className={buttonStyles({
                    color: props.color,
                    size: props.size
                })}
                {...props}
            >
                {props.text}
            </button>
        )
    }
}
