/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAPIDAPI_KEY: string
  readonly VITE_RAPIDAPI_HOST: string
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}