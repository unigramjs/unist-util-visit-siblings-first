import { describe, expect, test } from 'bun:test'
import { CONTINUE, type Parent, visit } from '../src'

const tree: Parent = {
	type: 'root',
	children: [
		{ type: 'a', children: [{ type: 'a1' }, { type: 'a2' }] },
		{ type: 'b', children: [{ type: 'b1' }, { type: 'b2' }] },
		{ type: 'c', children: [{ type: 'c1' }, { type: 'c2' }] },
	],
}

test('should traverse correctly', () => {
	const expected = [
		['root', null, ''],
		['a', 0, 'root'],
		['b', 1, 'root'],
		['c', 2, 'root'],
		['a1', 0, 'root, a'],
		['a2', 1, 'root, a'],
		['b1', 0, 'root, b'],
		['b2', 1, 'root, b'],
		['c1', 0, 'root, c'],
		['c2', 1, 'root, c'],
	]

	const actual: unknown[] = []
	visit(tree, (node, index, ancestors) => {
		const ancestorTypes = ancestors.map((el) => el.type).join(', ')
		actual.push([node.type, index, ancestorTypes])
	})

	expect(actual).toEqual(expected)
})

describe('Action test', () => {
	test('CONTINUE', () => {
		const expected = ['root', 'a', 'b', 'c', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']
		const actual: unknown[] = []
		visit(tree, ({ type }) => {
			actual.push(type)
			if (type === 'b') return CONTINUE
		})

		expect(actual).toEqual(expected)
	})

	test('SKIP', () => {
		const expected = ['root', 'a', 'b', 'c', 'a1', 'a2', 'c1', 'c2']
		const actual: unknown[] = []
		visit(tree, ({ type }) => {
			actual.push(type)
			if (type === 'b') return 'SKIP'
		})

		expect(actual).toEqual(expected)
	})

	test('EXIT', () => {
		const expected = ['root', 'a', 'b']
		const actual: unknown[] = []
		visit(tree, ({ type }) => {
			actual.push(type)
			if (type === 'b') return 'EXIT'
		})

		expect(actual).toEqual(expected)
	})
})
