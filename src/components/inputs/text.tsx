import React, { InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    ({ label, error, ...rest }, ref) => {
        return (
            <div className="relative flex w-full flex-col items-start">
                {label && (
                    <label className="mb-2 text-sm text-white">{label}</label>
                )}

                <div className="relative flex w-full items-center">
                    <input
                        ref={ref}
                        data-error={error !== undefined}
                        className="h-10 w-full rounded border border-zinc-600 bg-zinc-700 px-2.5 py-2 text-base font-normal text-white ring-transparent focus:border-zinc-600 focus:ring focus:ring-cyan-500 data-[error=true]:bg-red-700/10 data-[error=true]:ring-red-700"
                        {...rest}
                    />
                </div>

                {error && (
                    <span className="mt-1 text-xs text-red-500">{error}</span>
                )}
            </div>
        )
    }
)

TextInput.displayName = 'TextInput'

export default TextInput
