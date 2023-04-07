import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
	base: '',
	resolve: {
		alias: {
			'signalling-connect': resolve(__dirname, '../signalling-connect/src/connect.ts'),
			'signalling-client': resolve(__dirname, '../signalling-client/src/client.ts'),
		},
	},
	plugins: [react()],
})
