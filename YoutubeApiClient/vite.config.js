import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})





// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//    // turn off JS sourcemaps so installHook.js won’t reference a .map
//    esbuild: { sourcemap: false },
//    build: { sourcemap: false },
//   server: {
//     port: 5173, // Default Vite port
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000', // Backend server
//         changeOrigin: true,
//         secure: false,
//         rewrite: path => path.replace(/^\/api/, '/api'),
//       },
//     },
//   },
// });