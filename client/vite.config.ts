import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';
import  postcssCascadeLayers from '@csstools/postcss-cascade-layers';


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
    css: {
        postcss: {
            plugins: [
                postcssCascadeLayers()
            ],
        },
    }
});