/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIBLIB_ACCESS_KEY: string
  readonly VITE_LIBLIB_SECRET_KEY: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_DEV_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
