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
			entry: resolve(__dirname, 'src/connect.ts'),
			name: 'signalling-connect',
			// the proper extensions will be added
			fileName: 'signalling-connect',
		},
	},
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
	],
})
