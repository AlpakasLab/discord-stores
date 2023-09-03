import Link from 'next/link'
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonStyles = tv({
    base: 'font-semibold shrink-0 rounded-md transition-all duration-300',
    variants: {
        color: {
            primary: 'bg-cyan-500 text-white hover:bg-cyan-700',
            secondary: 'bg-purple-500 text-white'
        },
        size: {
            md: 'py-2 px-5 text-lg'
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
                className={buttonStyles({ color: props.color })}
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
                className={buttonStyles({ color: props.color })}
                {...props}
            >
                {props.text}
            </button>
        )
    }
}
