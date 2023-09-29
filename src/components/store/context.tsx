'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import tinycolor, { ColorFormats } from 'tinycolor2'

type StoreThemeColors = {
    primary: {
        default: ColorFormats.RGBA
        hover: ColorFormats.RGBA
        text: ColorFormats.RGBA
    } | null
    secondary: {
        default: ColorFormats.RGBA
        hover: ColorFormats.RGBA
        text: ColorFormats.RGBA
    } | null
}

type StoreContextData = {
    themed: boolean
    isManager: boolean
    comission: number | null
}

const StoreContext = createContext<null | StoreContextData>(null)

type StoreContextProviderProps = {
    children: React.ReactNode
    primaryColor: string | null
    secondaryColor: string | null
    isManager: boolean
    comission: number | null
}

export const StoreContextProvider = ({
    children,
    primaryColor,
    secondaryColor,
    isManager,
    comission
}: StoreContextProviderProps) => {
    const [colors, setColors] = useState<StoreThemeColors>({
        primary: null,
        secondary: null
    })

    const removeCSSVariables = () => {
        document.documentElement.removeAttribute('style')
    }

    const setCSSVariables = (colors: StoreThemeColors) => {
        const documentStyles = document.documentElement.style

        if (colors.primary !== null) {
            documentStyles.setProperty(
                `--color-primary`,
                `${colors.primary.default.r} ${colors.primary.default.g} ${colors.primary.default.b}`
            )
            documentStyles.setProperty(
                `--color-primary-hover`,
                `${colors.primary.hover.r} ${colors.primary.hover.g} ${colors.primary.hover.b}`
            )
            documentStyles.setProperty(
                `--color-primary-text`,
                `${colors.primary.text.r} ${colors.primary.text.g} ${colors.primary.text.b}`
            )
        } else {
            documentStyles.removeProperty(`--color-primary`)
            documentStyles.removeProperty(`--color-primary-hover`)
            documentStyles.removeProperty(`--color-primary-text`)
        }

        if (colors.secondary !== null) {
            documentStyles.setProperty(
                `--color-secondary`,
                `${colors.secondary.default.r} ${colors.secondary.default.g} ${colors.secondary.default.b}`
            )
            documentStyles.setProperty(
                `--color-secondary-hover`,
                `${colors.secondary.hover.r} ${colors.secondary.hover.g} ${colors.secondary.hover.b}`
            )
            documentStyles.setProperty(
                `--color-secondary-text`,
                `${colors.secondary.text.r} ${colors.secondary.text.g} ${colors.secondary.text.b}`
            )
        } else {
            documentStyles.removeProperty(`--color-secondary`)
            documentStyles.removeProperty(`--color-secondary-hover`)
            documentStyles.removeProperty(`--color-secondary-text`)
        }
    }

    useEffect(() => {
        setCSSVariables(colors)

        return () => {
            removeCSSVariables()
        }
    }, [colors])

    useEffect(() => {
        if (primaryColor && secondaryColor) {
            const lighterColor = '#ffffff'
            const darkerColor = '#18181b'

            const primaryHover = tinycolor(primaryColor).darken(10).toRgb()
            const primaryText = tinycolor(primaryColor).isDark()
                ? lighterColor
                : darkerColor

            const secondaryHover = tinycolor(secondaryColor).darken(10).toRgb()
            const secondaryText = tinycolor(secondaryColor).isDark()
                ? lighterColor
                : darkerColor

            setColors({
                primary: {
                    default: tinycolor(primaryColor).toRgb(),
                    hover: primaryHover,
                    text: tinycolor(primaryText).toRgb()
                },
                secondary: {
                    default: tinycolor(secondaryColor).toRgb(),
                    hover: secondaryHover,
                    text: tinycolor(secondaryText).toRgb()
                }
            })
        }
    }, [primaryColor, secondaryColor])

    return (
        <StoreContext.Provider
            value={{ themed: colors.primary !== null, isManager, comission }}
        >
            {children}
        </StoreContext.Provider>
    )
}

export const useStoreContext = () => {
    const context = useContext(StoreContext)

    if (!context)
        throw new Error(
            'Cannot use Store Context outside of Store Context Provider'
        )

    return context
}
