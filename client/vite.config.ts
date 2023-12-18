import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
    base: "/",
    server: {
        port: 3003,
        host: "0.0.0.0"
    },
    plugins: [
        react(),
        legacy({
            polyfills: [],
            targets: ['samsung >= 4'],
            modernPolyfills: ['es.object.from-entries', 'es.array.to-spliced'],
        }),
    ],
    ssr: {
        noExternal: ["primereact", "primeicons"]
    },
    build: {
        target: ['es2020', 'chrome61', 'safari11']
    }
});