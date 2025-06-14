
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Set the base path for GitHub Pages.
  // If your repository name is different, change '/promptmatrix/' accordingly.
  // For example, if your repo is 'my-awesome-app', base should be '/my-awesome-app/'.
  base: '/promptmatrix/',
  plugins: [react()],
  define: {
    // Make the API_KEY environment variable available in client-side code via process.env.API_KEY
    // The value of process.env.API_KEY on the right side of the colon
    // comes from the build environment (e.g., GitHub Actions Secrets for GitHub Pages).
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    rollupOptions: {
      // No longer externalizing @google/genai
      // external: ['@google/genai'], // This line is removed/commented out
    },
  },
});