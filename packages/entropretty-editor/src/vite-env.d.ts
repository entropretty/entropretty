/// <reference types="vite/client" />
declare const __SCRIPTS__: string[]

interface ImportMetaEnv {
  readonly VITE_SCRIPTS: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
