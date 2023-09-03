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
                    <label className="mb-2 text-base font-semibold text-black">
                        {label}
                    </label>
                )}

                <div className="relative flex w-full items-center">
                    <input
                        ref={ref}
                        data-error={error !== undefined}
                        className="focs:ring h-12 w-full rounded border-none bg-white px-4 py-3 text-base font-normal text-black ring-transparent focus:ring-green-500 data-[error=true]:bg-red-500/10"
                        {...rest}
                    />
                </div>

                {error && (
                    <span className="mt-1 text-sm text-red-500">{error}</span>
                )}
            </div>
        )
    }
)

TextInput.displayName = 'TextInput'

export default TextInput
