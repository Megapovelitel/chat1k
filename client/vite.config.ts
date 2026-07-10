/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import vitestConfig from './vitest.ts'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        checker({
            typescript: {
                tsconfigPath: './tsconfig.app.json'
            },
            eslint: {
                lintCommand: 'eslint .'
            }
        })
    ],
    test: vitestConfig,
    server: {
        port: 7070
    },
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, './src/components')
        }
    }
})
