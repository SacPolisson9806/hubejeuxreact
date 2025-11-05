import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // Hook pour copier _redirects après le build
  closeBundle() {
    copyFileSync('_redirects', 'dist/_redirects');
  }
});
