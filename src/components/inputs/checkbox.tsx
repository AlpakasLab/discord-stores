import React, { type InputHTMLAttributes } from 'react'

type CheckboxInputProps = {
    children: React.ReactNode
    error?: string
} & InputHTMLAttributes<HTMLInputElement>

const CheckboxInput = React.forwardRef<HTMLInputElement, CheckboxInputProps>(
    ({ children, error, ...rest }, ref) => {
        return (
            <div className="relative flex w-full flex-col items-start">
                <p className="flex items-center text-sm text-white">
                    <input
                        ref={ref}
                        data-error={error !== undefined}
                        className="form-checkbox mr-2 h-5 w-5 shrink-0 rounded-md border border-zinc-600 bg-zinc-700 text-base font-normal text-cyan-400 ring-transparent focus:border-zinc-600 focus:ring focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 data-[error=true]:bg-red-700/10 data-[error=true]:ring-red-700"
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
