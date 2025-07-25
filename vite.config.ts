import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    root: "./src",
    build:{
        outDir: "./dist"
    },
    plugins: [tsconfigPaths()],
    resolve: {
        extensions:[".ts", ".js"]
    }
})