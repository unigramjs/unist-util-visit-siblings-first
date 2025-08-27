import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: ['./src/index.ts'],
	platform: 'browser',
	target: 'es2023',
	format: ['esm', 'cjs'],
	dts: true,
	shims: true,
	exports: true,
	failOnWarn: true,
	unbundle: true,
})
