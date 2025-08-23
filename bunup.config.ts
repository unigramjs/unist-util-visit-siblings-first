import { defineConfig } from 'bunup'
import { exports, shims, unused } from 'bunup/plugins'

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	plugins: [
		exports(),
		shims(),
		unused({ level: 'error', ignore: ['@types/unist'] }),
	],
})
