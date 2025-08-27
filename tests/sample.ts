import type { Parent } from './types.ts'

export function getSample(): Parent {
	return JSON.parse(JSON.stringify(sample))
}

const sample = {
	type: 'root',
	children: [
		{
			type: '1',
			children: [
				{
					type: '1.1',
					children: [{ type: '1.1.1' }, { type: '1.1.2' }, { type: '1.1.3' }],
				},
				{
					type: '1.2',
					children: [{ type: '1.2.1' }, { type: '1.2.2' }, { type: '1.2.3' }],
				},
				{
					type: '1.3',
					children: [{ type: '1.3.1' }, { type: '1.3.2' }, { type: '1.3.3' }],
				},
			],
		},
		{
			type: '2',
			children: [
				{
					type: '2.1',
					children: [{ type: '2.1.1' }, { type: '2.1.2' }, { type: '2.1.3' }],
				},
				{
					type: '2.2',
					children: [{ type: '2.2.1' }, { type: '2.2.2' }, { type: '2.2.3' }],
				},
				{
					type: '2.3',
					children: [{ type: '2.3.1' }, { type: '2.3.2' }, { type: '2.3.3' }],
				},
			],
		},
		{
			type: '3',
			children: [
				{
					type: '3.1',
					children: [{ type: '3.1.1' }, { type: '3.1.2' }, { type: '3.1.3' }],
				},
				{
					type: '3.2',
					children: [{ type: '3.2.1' }, { type: '3.2.2' }, { type: '3.2.3' }],
				},
				{
					type: '3.3',
					children: [{ type: '3.3.1' }, { type: '3.3.2' }, { type: '3.3.3' }],
				},
			],
		},
	],
} as const
