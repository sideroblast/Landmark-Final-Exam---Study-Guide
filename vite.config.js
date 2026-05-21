import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` uses relative asset paths, so the built site works no matter
// what the repository (and therefore the GitHub Pages subpath) is named.
export default defineConfig({
  plugins: [react()],
  base: './',
});
