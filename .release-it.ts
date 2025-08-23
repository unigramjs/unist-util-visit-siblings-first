import type { Config } from 'release-it'

export default {
	// git: {
	// 	commit: true,
	// 	tag: true,
	// 	push: true,
	// },
	// github: {
	// 	release: true,
	// },
	// npm: {
	// 	publish: false,
	// },
	plugins: {
		'@release-it/conventional-changelog': {
			preset: {
				name: 'angular',
			},
			infile: 'CHANGELOG.md',
		},
	},
} satisfies Config
