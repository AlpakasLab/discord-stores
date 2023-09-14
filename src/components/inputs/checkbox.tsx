import React, { type InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type CheckboxInputProps = {
    children: React.ReactNode
    error?: string
} & InputHTMLAttributes<HTMLInputElement>

const CheckboxInput = React.forwardRef<HTMLInputElement, CheckboxInputProps>(
    ({ children, error, className, ...rest }, ref) => {
        return (
            <div className="relative flex w-full flex-col items-start">
                <p className="flex items-center text-sm text-white">
                    <input
                        ref={ref}
                        type="checkbox"
                        data-error={error !== undefined}
                        className={twMerge(
                            'form-checkbox mr-2 h-5 w-5 shrink-0 rounded-md border border-zinc-600 bg-zinc-700 text-base font-normal text-cyan-400 focus:border-zinc-600 focus:shadow-none focus:ring-transparent disabled:cursor-not-allowed disabled:opacity-50 data-[error=true]:bg-red-700/10',
                            className
                        )}
                        {...rest}
                    />
                    {children}
                </p>

                {error && (
                    <span className="mt-1 text-xs text-red-500">{error}</span>
                )}
            </div>
        )
    }
)

CheckboxInput.displayName = 'CheckboxInput'
export default CheckboxInput
