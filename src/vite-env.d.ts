/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODEM_PAY_API_KEY: string;
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
