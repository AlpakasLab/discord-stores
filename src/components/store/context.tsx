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
}

const StoreContext = createContext<null | StoreContextData>(null)

type StoreContextProviderProps = {
    children: React.ReactNode
    storeId: string
}

export const StoreContextProvider = ({
    children,
    storeId
}: StoreContextProviderProps) => {
    const [loaded, setLoaded] = useState(false)
    const [colors, setColors] = useState<StoreThemeColors>({
        primary: null,
        secondary: null
    })
    const [isManager, setIsManager] = useState(false)

    const getStoreConfiguration = async (id: string) => {
        const request = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/store?id=${id}`
        )
        if (!request.ok)
            throw new Error('Cannot get store information, retry later.')
        const { data } = await request.json()

        if (data.primaryColor && data.secondaryColor) {
            const primaryHover = tinycolor(data.primaryColor).darken(10).toRgb()
            const primaryText = tinycolor(data.primaryColor).isDark()
                ? '#ffffff'
                : '#18181b'

            const secondaryHover = tinycolor(data.secondaryColor)
                .darken(10)
                .toRgb()
            const secondaryText = tinycolor(data.secondaryColor).isDark()
                ? '#ffffff'
                : '#18181b'

            setColors({
                primary: {
                    default: tinycolor(data.primaryColor).toRgb(),
                    hover: primaryHover,
                    text: tinycolor(primaryText).toRgb()
                },
                secondary: {
                    default: tinycolor(data.secondaryColor).toRgb(),
                    hover: secondaryHover,
                    text: tinycolor(secondaryText).toRgb()
                }
            })
        }
    }

    const getEmployeeRole = async () => {
        const request = await fetch(
            `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/me`
        )
        if (!request.ok)
            throw new Error('Cannot user information, retry later.')
        const data = await request.json()

        if (data.manager) {
            setIsManager(true)
        }
    }

    const removeCSSVariables = () => {
        document.documentElement.removeAttribute('style')
    }

    const setCSSVariables = (colors: StoreThemeColors) => {
        if (colors.primary !== null) {
            document.documentElement.style.setProperty(
                `--color-primary`,
                `${colors.primary.default.r} ${colors.primary.default.g} ${colors.primary.default.b}`
            )
            document.documentElement.style.setProperty(
                `--color-primary-hover`,
                `${colors.primary.hover.r} ${colors.primary.hover.g} ${colors.primary.hover.b}`
            )
            document.documentElement.style.setProperty(
                `--color-primary-text`,
                `${colors.primary.text.r} ${colors.primary.text.g} ${colors.primary.text.b}`
            )
        } else {
            document.documentElement.style.removeProperty(`--color-primary`)
            document.documentElement.style.removeProperty(
                `--color-primary-hover`
            )
            document.documentElement.style.removeProperty(
                `--color-primary-text`
            )
        }

        if (colors.secondary !== null) {
            document.documentElement.style.setProperty(
                `--color-secondary`,
                `${colors.secondary.default.r} ${colors.secondary.default.g} ${colors.secondary.default.b}`
            )
            document.documentElement.style.setProperty(
                `--color-secondary-hover`,
                `${colors.secondary.hover.r} ${colors.secondary.hover.g} ${colors.secondary.hover.b}`
            )
            document.documentElement.style.setProperty(
                `--color-secondary-text`,
                `${colors.secondary.text.r} ${colors.secondary.text.g} ${colors.secondary.text.b}`
            )
        } else {
            document.documentElement.style.removeProperty(`--color-secondary`)
            document.documentElement.style.removeProperty(
                `--color-secondary-hover`
            )
            document.documentElement.style.removeProperty(
                `--color-secondary-text`
            )
        }
    }

    useEffect(() => {
        setCSSVariables(colors)

        return () => {
            removeCSSVariables()
        }
    }, [colors])

    useEffect(() => {
        if (!loaded) {
            getStoreConfiguration(storeId)
            getEmployeeRole()
            setLoaded(true)
        }
    }, [loaded, storeId])

    return (
        <StoreContext.Provider
            value={{ themed: colors.primary !== null, isManager }}
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
