// /// <reference types="vite/client" /> // Commented out to prevent error if "vite/client" types are not found

// Explicitly define ImportMetaEnv and ImportMeta to ensure Vite's environment variables are typed.
// This is helpful if the `vite/client` reference itself isn't fully resolving types
// in the project's specific TypeScript setup.
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  // Add other Vite environment variables defined in your project here
  // Example: readonly VITE_MY_VARIABLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// This makes `process.env.API_KEY` (from vite.config.js define) known to TypeScript
// It's accessed as `process.env.API_KEY` in App.tsx
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY?: string; // Mark as optional if it might not be defined during all dev/build stages
  }
}
