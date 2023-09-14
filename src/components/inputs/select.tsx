import { Listbox } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'

type BaseProps = {
    label?: string
    error?: string
    disabled?: boolean
    options: Array<{ label: string; value: string; disabled?: boolean }>
}

type SingleSelectProps = {
    mode: 'single'
    defaultOption?: string | null
    onSelectOption?: (option: { label: string; value: string } | null) => void
} & BaseProps

type MultiSelectProps = {
    mode: 'multi'
    defaultOption?: string[] | null
    onSelectOption?: (option: { label: string; value: string }[] | null) => void
} & BaseProps

type SelectInputProps = SingleSelectProps | MultiSelectProps

export default function SelectInput({
    mode,
    label,
    error,
    disabled = false,
    options,
    defaultOption,
    onSelectOption
}: SelectInputProps) {
    const [selectedOption, setSelectedOption] = useState<
        | null
        | {
              label: string
              value: string
          }
        | {
              label: string
              value: string
          }[]
    >(null)

    useEffect(() => {
        if (mode === 'single' && defaultOption && selectedOption === null) {
            const defaultItem = options.find(
                item => item.value === defaultOption
            )
            if (defaultItem) setSelectedOption(defaultItem)
        } else if (
            mode === 'multi' &&
            defaultOption &&
            selectedOption === null
        ) {
            const defaultItems = options.filter(item =>
                defaultOption.find(option => option === item.value)
            )
            setSelectedOption(defaultItems)
        }
    }, [defaultOption, mode, options, selectedOption])

    return (
        <div className="relative flex w-full flex-col items-start">
            {label && (
                <label className="mb-2 text-sm text-white">{label}</label>
            )}

            <Listbox
                as="div"
                className="relative flex w-full flex-col"
                value={mode === 'multi' ? selectedOption ?? [] : selectedOption}
                onChange={option => {
                    setSelectedOption(option)
                    if (
                        mode === 'single' &&
                        onSelectOption &&
                        (option === null || 'value' in option)
                    )
                        onSelectOption(option)

                    if (
                        mode === 'multi' &&
                        onSelectOption &&
                        (option === null || Array.isArray(option))
                    )
                        onSelectOption(option)
                }}
                multiple={mode === 'multi'}
                disabled={disabled}
            >
                <Listbox.Button
                    data-error={error !== undefined}
                    className="form-select h-10 w-full rounded-md border border-zinc-600 bg-zinc-700 px-2.5 py-2 text-left text-base font-normal text-white focus:border-zinc-600 focus:shadow-none focus:ring-transparent data-[error=true]:bg-red-700/10 ui-disabled:cursor-not-allowed ui-disabled:opacity-50"
                >
                    {selectedOption !== null &&
                        'label' in selectedOption &&
                        selectedOption.label}
                    {selectedOption !== null &&
                        Array.isArray(selectedOption) &&
                        selectedOption.map(item => item.label).join(', ')}
                </Listbox.Button>
                <Listbox.Options className="absolute top-[110%] z-10 flex h-fit max-h-[13rem] w-full flex-col overflow-hidden overflow-y-auto rounded-md bg-zinc-600 shadow-md">
                    {React.Children.toArray(
                        options.map(option => (
                            <Listbox.Option
                                className="flex cursor-pointer items-center gap-x-3 px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-zinc-400 ui-disabled:cursor-not-allowed ui-disabled:bg-zinc-700 ui-disabled:opacity-50"
                                value={option}
                                disabled={option.disabled === true}
                            >
                                {option.label}
                                <FaCheck className="hidden text-xs text-emerald-500 ui-selected:block" />
                            </Listbox.Option>
                        ))
                    )}
                </Listbox.Options>
            </Listbox>

            {error && (
                <span className="mt-1 text-xs text-red-500">{error}</span>
            )}
        </div>
    )
}
