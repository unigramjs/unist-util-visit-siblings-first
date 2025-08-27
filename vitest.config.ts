import { env } from 'node:process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		bail: 1,
		coverage: {
			enabled: true,
			thresholds: { '100': true },
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.type.ts', 'src/**/index.ts'],
		},
		sequence: { concurrent: env.DEBUG !== 'true' },
		fileParallelism: env.DEBUG !== 'true',
	},
})
