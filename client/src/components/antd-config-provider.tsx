import { ConfigProvider, theme } from 'antd'
import { useCallback, useEffect, useState } from 'react'

type AntdConfigProviderProps = {
    children?: React.ReactNode
}

export const AntdConfigProvider = (props: AntdConfigProviderProps) => {
    const windowQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const [mode, setMode] = useState<'light' | 'dark'>(windowQuery.matches ? 'dark' : 'light')

    const changeMode = useCallback((event: MediaQueryListEvent) => {
        setMode(event.matches ? 'dark' : 'light')
    }, [])

    useEffect(() => {
        windowQuery.addEventListener('change', changeMode)
        return () => {
            windowQuery.removeEventListener('change', changeMode)
        }
    }, [windowQuery, changeMode])

    return (
        <ConfigProvider
            theme={{
                algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
            }}
        >
            {props.children}
        </ConfigProvider>
    )
}
