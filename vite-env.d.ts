// /// <reference types="vite/client" />
// The line above is commented out because the error "Cannot find type definition file for 'vite/client'"
// indicates it's not being resolved.
// Providing a minimal manual definition for the used parts of import.meta.env as a workaround.

interface ImportMetaEnv {
  readonly DEV: boolean;
  // readonly PROD: boolean; // Add if used
  // readonly MODE: string; // Add if used
  // readonly BASE_URL: string; // Add if used
  // Add other VITE_ prefixed variables if they are used and cause type errors
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
