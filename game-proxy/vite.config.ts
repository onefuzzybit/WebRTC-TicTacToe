// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		minify: false,
		sourcemap: true,
		target: 'esnext',
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'game-proxy',
			// the proper extensions will be added
			fileName: 'game-proxy',
		},
	},
	plugins: [
		dts({
			skipDiagnostics: false,
			insertTypesEntry: true,
		}),
	],
})
