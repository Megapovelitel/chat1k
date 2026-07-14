/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_ROUTE: string
    readonly VITE_WEBSOCKET_HOST: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
