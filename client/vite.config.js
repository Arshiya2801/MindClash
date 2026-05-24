import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],

    server: {
        port: 5173,
        proxy: {
            // In development, proxy API and socket calls to the local Express server
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
            '/socket.io': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                ws: true,
            },
        },
    },

    build: {
        outDir: 'dist',
        sourcemap: false,
        // Prevent build failures from type errors
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
                warn(warning);
            },
        },
    },

    // In production on Vercel, VITE_API_URL should be set to:
    // https://your-render-backend.onrender.com/api
    // The socket.js service strips /api to get the base socket URL automatically.
});
