import React, { type TextareaHTMLAttributes } from 'react'

type MessageInputProps = {
    label?: string
    error?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

const MessageInput = React.forwardRef<HTMLTextAreaElement, MessageInputProps>(
    ({ label, error, ...rest }, ref) => {
        return (
            <div className="relative flex w-full flex-col items-start">
                {label && (
                    <label className="mb-2 text-sm text-white">{label}</label>
                )}

                <div className="relative flex w-full items-center">
                    <textarea
                        ref={ref}
                        data-error={error !== undefined}
                        className="h-24 w-full resize-none rounded-md border border-zinc-600 bg-zinc-700 px-2.5 py-2 text-base font-normal text-white focus:border-zinc-600 focus:shadow-none focus:ring-transparent data-[error=true]:bg-red-700/10"
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

MessageInput.displayName = 'MessageInput'
export default MessageInput
