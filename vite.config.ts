import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        base: './',
        plugins: [ react() ],
        build: {
            lib: mode === 'lib' ? {
                entry: 'src/index.ts',
                // name: '@gladiolus/modal',
                formats: [ 'cjs', 'es' ]
            } : false
        }
    }
})
