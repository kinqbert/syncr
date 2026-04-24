/// <reference types='vite/client' />

interface ImportMetaEnv {
  readonly CLIENT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
