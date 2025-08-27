import { describe, test } from 'vitest'
import { visit } from '../../src/unist-util-visit-siblings.ts'
import { Result } from '../create-result.ts'
import { getSample } from '../sample.ts'
import type { Expected, Nodes } from '../types.ts'

describe('should continue at the current index', (test) => {
	test('repeat at the first child', (t) => {
		const expected = [
			// LEVEl 0 ------------------------------------------

			['root', undefined, []],

			// LEVEL 1 ------------------------------------------

			['1', 0, ['root']],
			['2', 1, ['root']],
			['3', 2, ['root']],

			// LEVEL 2 ------------------------------------------

			['new-a', 0, ['root', '1']], // root - 1
			['new-b', 1, ['root', '1']],
			// ['1.1', 0, ['root', '1']],
			['1.2', 2, ['root', '1']],
			['1.3', 3, ['root', '1']],
			['2.1', 0, ['root', '2']], // root - 2
			['2.2', 1, ['root', '2']],
			['2.3', 2, ['root', '2']],
			['3.1', 0, ['root', '3']], // root - 3
			['3.2', 1, ['root', '3']],
			['3.3', 2, ['root', '3']],

			// LEVEL 3 ------------------------------------------

			['new-b.1', 0, ['root', '1', 'new-b']], // root - 1 - new-b
			// ['1.1.1', 0, ['root', '1', '1.1']],
			// ['1.1.2', 1, ['root', '1', '1.1']],
			// ['1.1.3', 2, ['root', '1', '1.1']],
			['1.2.1', 0, ['root', '1', '1.2']], // root - 1 - 1.2
			['1.2.2', 1, ['root', '1', '1.2']],
			['1.2.3', 2, ['root', '1', '1.2']],
			['1.3.1', 0, ['root', '1', '1.3']], // root - 1 - 1.3
			['1.3.2', 1, ['root', '1', '1.3']],
			['1.3.3', 2, ['root', '1', '1.3']],
			['2.1.1', 0, ['root', '2', '2.1']], // root - 2 - 2.1
			['2.1.2', 1, ['root', '2', '2.1']],
			['2.1.3', 2, ['root', '2', '2.1']],
			['2.2.1', 0, ['root', '2', '2.2']], // root - 2 - 2.2
			['2.2.2', 1, ['root', '2', '2.2']],
			['2.2.3', 2, ['root', '2', '2.2']],
			['2.3.1', 0, ['root', '2', '2.3']], // root - 2 - 2.3
			['2.3.2', 1, ['root', '2', '2.3']],
			['2.3.3', 2, ['root', '2', '2.3']],
			['3.1.1', 0, ['root', '3', '3.1']], // root - 3 - 3.1
			['3.1.2', 1, ['root', '3', '3.1']],
			['3.1.3', 2, ['root', '3', '3.1']],
			['3.2.1', 0, ['root', '3', '3.2']], // root - 3 - 3.2
			['3.2.2', 1, ['root', '3', '3.2']],
			['3.2.3', 2, ['root', '3', '3.2']],
			['3.3.1', 0, ['root', '3', '3.3']], // root - 3 - 3.3
			['3.3.2', 1, ['root', '3', '3.3']],
			['3.3.3', 2, ['root', '3', '3.3']],
		] as const satisfies Expected

		const actual = new Result()

		visit(getSample(), (node, index, ancestorList) => {
			if (node.type === '1.1') {
				const parent = ancestorList.at(-1)

				if (parent === undefined)
					throw new Error('Parent must be present for non-root nodes')
				if (index === undefined)
					throw new Error('Index must be present for non-root nodes')

				const newNodeList: Nodes[] = [
					{ type: 'new-a' },
					{ type: 'new-b', children: [{ type: 'new-b.1' }] },
				]

				parent.children.splice(index, 1, ...newNodeList)
				return index
			}

			actual.add(node, index, ancestorList)
			return 'CONTINUE'
		})

		t.expect(actual.value).toStrictEqual(expected)
	})

	test('repeat at the last child', (t) => {
		const expected = [
			// LEVEl 0 ------------------------------------------

			['root', undefined, []],

			// LEVEL 1 ------------------------------------------

			['1', 0, ['root']],
			['2', 1, ['root']],
			['3', 2, ['root']],

			// LEVEL 2 ------------------------------------------

			['1.1', 0, ['root', '1']], // root - 1
			['1.2', 1, ['root', '1']],
			// ['1.3', 2, ['root', '1']],
			['new-a', 2, ['root', '1']],
			['new-b', 3, ['root', '1']],
			['2.1', 0, ['root', '2']], // root - 2
			['2.2', 1, ['root', '2']],
			['2.3', 2, ['root', '2']],
			['3.1', 0, ['root', '3']], // root - 3
			['3.2', 1, ['root', '3']],
			['3.3', 2, ['root', '3']],

			// LEVEL 3 ------------------------------------------

			['1.1.1', 0, ['root', '1', '1.1']], // root - 1 - 1.1
			['1.1.2', 1, ['root', '1', '1.1']],
			['1.1.3', 2, ['root', '1', '1.1']],
			['1.2.1', 0, ['root', '1', '1.2']], // root - 1 - 1.2
			['1.2.2', 1, ['root', '1', '1.2']],
			['1.2.3', 2, ['root', '1', '1.2']],
			['new-b.1', 0, ['root', '1', 'new-b']], // root - 1 - new-b
			// ['1.3.1', 0, ['root', '1', '1.3']],
			// ['1.3.2', 1, ['root', '1', '1.3']],
			// ['1.3.3', 2, ['root', '1', '1.3']],
			['2.1.1', 0, ['root', '2', '2.1']], // root - 2 - 2.1
			['2.1.2', 1, ['root', '2', '2.1']],
			['2.1.3', 2, ['root', '2', '2.1']],
			['2.2.1', 0, ['root', '2', '2.2']], // root - 2 - 2.2
			['2.2.2', 1, ['root', '2', '2.2']],
			['2.2.3', 2, ['root', '2', '2.2']],
			['2.3.1', 0, ['root', '2', '2.3']], // root - 2 - 2.3
			['2.3.2', 1, ['root', '2', '2.3']],
			['2.3.3', 2, ['root', '2', '2.3']],
			['3.1.1', 0, ['root', '3', '3.1']], // root - 3 - 3.1
			['3.1.2', 1, ['root', '3', '3.1']],
			['3.1.3', 2, ['root', '3', '3.1']],
			['3.2.1', 0, ['root', '3', '3.2']], // root - 3 - 3.2
			['3.2.2', 1, ['root', '3', '3.2']],
			['3.2.3', 2, ['root', '3', '3.2']],
			['3.3.1', 0, ['root', '3', '3.3']], // root - 3 - 3.3
			['3.3.2', 1, ['root', '3', '3.3']],
			['3.3.3', 2, ['root', '3', '3.3']],
		] as const satisfies Expected

		const actual = new Result()

		visit(getSample(), (node, index, ancestorList) => {
			if (node.type === '1.3') {
				const parent = ancestorList.at(-1)

				if (parent === undefined)
					throw new Error('Parent must be present for non-root nodes')
				if (index === undefined)
					throw new Error('Index must be present for non-root nodes')

				const newNodeList: Nodes[] = [
					{ type: 'new-a' },
					{ type: 'new-b', children: [{ type: 'new-b.1' }] },
				]

				parent.children.splice(index, 1, ...newNodeList)
				return index
			}

			actual.add(node, index, ancestorList)
			return 'CONTINUE'
		})

		t.expect(actual.value).toStrictEqual(expected)
	})

	test('repeat at the middle child', (t) => {
		const expected = [
			// LEVEl 0 ------------------------------------------

			['root', undefined, []],

			// LEVEL 1 ------------------------------------------

			['1', 0, ['root']],
			['2', 1, ['root']],
			['3', 2, ['root']],

			// LEVEL 2 ------------------------------------------

			['1.1', 0, ['root', '1']], // root - 1
			['1.2', 1, ['root', '1']],
			['1.3', 2, ['root', '1']],
			['2.1', 0, ['root', '2']], // root - 2
			// ['2.2', 1, ['root', '2']],
			['new-a', 1, ['root', '2']],
			['new-b', 2, ['root', '2']],
			['2.3', 3, ['root', '2']],
			['3.1', 0, ['root', '3']], // root - 3
			['3.2', 1, ['root', '3']],
			['3.3', 2, ['root', '3']],

			// LEVEL 3 ------------------------------------------

			['1.1.1', 0, ['root', '1', '1.1']], // root - 1 - 1.1
			['1.1.2', 1, ['root', '1', '1.1']],
			['1.1.3', 2, ['root', '1', '1.1']],
			['1.2.1', 0, ['root', '1', '1.2']], // root - 1 - 1.2
			['1.2.2', 1, ['root', '1', '1.2']],
			['1.2.3', 2, ['root', '1', '1.2']],
			['1.3.1', 0, ['root', '1', '1.3']], // root - 1 - 1.3
			['1.3.2', 1, ['root', '1', '1.3']],
			['1.3.3', 2, ['root', '1', '1.3']],
			['2.1.1', 0, ['root', '2', '2.1']], // root - 2 - 2.1
			['2.1.2', 1, ['root', '2', '2.1']],
			['2.1.3', 2, ['root', '2', '2.1']],
			['new-b.1', 0, ['root', '2', 'new-b']], // root - 2 - new-b
			// ['2.2.1', 0, ['root', '2', '2.2']],
			// ['2.2.2', 1, ['root', '2', '2.2']],
			// ['2.2.3', 2, ['root', '2', '2.2']],
			['2.3.1', 0, ['root', '2', '2.3']], // root - 2 - 2.3
			['2.3.2', 1, ['root', '2', '2.3']],
			['2.3.3', 2, ['root', '2', '2.3']],
			['3.1.1', 0, ['root', '3', '3.1']], // root - 3 - 3.1
			['3.1.2', 1, ['root', '3', '3.1']],
			['3.1.3', 2, ['root', '3', '3.1']],
			['3.2.1', 0, ['root', '3', '3.2']], // root - 3 - 3.2
			['3.2.2', 1, ['root', '3', '3.2']],
			['3.2.3', 2, ['root', '3', '3.2']],
			['3.3.1', 0, ['root', '3', '3.3']], // root - 3 - 3.3
			['3.3.2', 1, ['root', '3', '3.3']],
			['3.3.3', 2, ['root', '3', '3.3']],
		] as const satisfies Expected

		const actual = new Result()

		visit(getSample(), (node, index, ancestorList) => {
			if (node.type === '2.2') {
				const parent = ancestorList.at(-1)

				if (parent === undefined)
					throw new Error('Parent must be present for non-root nodes')
				if (index === undefined)
					throw new Error('Index must be present for non-root nodes')

				const newNodeList: Nodes[] = [
					{ type: 'new-a' },
					{ type: 'new-b', children: [{ type: 'new-b.1' }] },
				]

				parent.children.splice(index, 1, ...newNodeList)
				return index
			}

			actual.add(node, index, ancestorList)
			return 'CONTINUE'
		})

		t.expect(actual.value).toStrictEqual(expected)
	})
})

test('should continue at the next index', (t) => {
	const expected = [
		// LEVEl 0 ------------------------------------------

		['root', undefined, []],

		// LEVEL 1 ------------------------------------------

		['1', 0, ['root']],
		['2', 1, ['root']],
		['3', 2, ['root']],

		// LEVEL 2 ------------------------------------------

		['1.1', 0, ['root', '1']], // root - 1
		['1.2', 1, ['root', '1']],
		['1.3', 2, ['root', '1']],
		['2.1', 0, ['root', '2']], // root - 2
		// ['2.2', 1, ['root', '2']],
		// ['new-a', 1, ['root', '2']],
		// ['new-b', 2, ['root', '2']],
		['2.3', 3, ['root', '2']],
		['3.1', 0, ['root', '3']], // root - 3
		['3.2', 1, ['root', '3']],
		['3.3', 2, ['root', '3']],

		// LEVEL 3 ------------------------------------------

		['1.1.1', 0, ['root', '1', '1.1']], // root - 1 - 1.1
		['1.1.2', 1, ['root', '1', '1.1']],
		['1.1.3', 2, ['root', '1', '1.1']],
		['1.2.1', 0, ['root', '1', '1.2']], // root - 1 - 1.2
		['1.2.2', 1, ['root', '1', '1.2']],
		['1.2.3', 2, ['root', '1', '1.2']],
		['1.3.1', 0, ['root', '1', '1.3']], // root - 1 - 1.3
		['1.3.2', 1, ['root', '1', '1.3']],
		['1.3.3', 2, ['root', '1', '1.3']],
		['2.1.1', 0, ['root', '2', '2.1']], // root - 2 - 2.1
		['2.1.2', 1, ['root', '2', '2.1']],
		['2.1.3', 2, ['root', '2', '2.1']],
		// ['2.2.1', 0, ['root', '2', '2.2']], // root - 2 - 2.2
		// ['2.2.2', 1, ['root', '2', '2.2']],
		// ['2.2.3', 2, ['root', '2', '2.2']],
		['2.3.1', 0, ['root', '2', '2.3']], // root - 2 - 2.3
		['2.3.2', 1, ['root', '2', '2.3']],
		['2.3.3', 2, ['root', '2', '2.3']],
		['3.1.1', 0, ['root', '3', '3.1']], // root - 3 - 3.1
		['3.1.2', 1, ['root', '3', '3.1']],
		['3.1.3', 2, ['root', '3', '3.1']],
		['3.2.1', 0, ['root', '3', '3.2']], // root - 3 - 3.2
		['3.2.2', 1, ['root', '3', '3.2']],
		['3.2.3', 2, ['root', '3', '3.2']],
		['3.3.1', 0, ['root', '3', '3.3']], // root - 3 - 3.3
		['3.3.2', 1, ['root', '3', '3.3']],
		['3.3.3', 2, ['root', '3', '3.3']],
	] as const satisfies Expected

	const actual = new Result()

	visit(getSample(), (node, index, ancestorList) => {
		if (node.type === '2.2') {
			const parent = ancestorList.at(-1)

			if (parent === undefined)
				throw new Error('Parent must be present for non-root nodes')
			if (index === undefined)
				throw new Error('Index must be present for non-root nodes')

			const newNodeList: Nodes[] = [
				{ type: 'new-a' },
				{ type: 'new-b', children: [{ type: 'new-b.1' }] },
			]

			parent.children.splice(index, 1, ...newNodeList)
			return index + 2
		}

		actual.add(node, index, ancestorList)
		return 'CONTINUE'
	})

	t.expect(actual.value).toStrictEqual(expected)
})

test('should continue at the previous index', (t) => {
	const expected = [
		// LEVEl 0 ------------------------------------------

		['root', undefined, []],

		// LEVEL 1 ------------------------------------------

		['1', 0, ['root']],
		['2', 1, ['root']],
		['3', 2, ['root']],

		// LEVEL 2 ------------------------------------------
		['1.1', 0, ['root', '1']], // root - 1
		['1.2', 1, ['root', '1']],
		['1.1', 0, ['root', '1']], // repeated
		['1.2', 1, ['root', '1']], // repeated
		// ['1.3', 2, ['root', '1']],
		['new-a', 2, ['root', '1']],
		['new-b', 3, ['root', '1']],
		['2.1', 0, ['root', '2']], // root - 2
		['2.2', 1, ['root', '2']],
		['2.3', 2, ['root', '2']],
		['3.1', 0, ['root', '3']], // root - 3
		['3.2', 1, ['root', '3']],
		['3.3', 2, ['root', '3']],

		// LEVEL 3 ------------------------------------------

		['1.1.1', 0, ['root', '1', '1.1']], // root - 1 - 1.1
		['1.1.2', 1, ['root', '1', '1.1']],
		['1.1.3', 2, ['root', '1', '1.1']],
		['1.2.1', 0, ['root', '1', '1.2']], // root - 1 - 1.2
		['1.2.2', 1, ['root', '1', '1.2']],
		['1.2.3', 2, ['root', '1', '1.2']],
		['new-b.1', 0, ['root', '1', 'new-b']], // root - 1 - new-b
		// ['1.3.1', 0, ['root', '1', '1.3']],
		// ['1.3.2', 1, ['root', '1', '1.3']],
		// ['1.3.3', 2, ['root', '1', '1.3']],
		['2.1.1', 0, ['root', '2', '2.1']], // root - 2 - 2.1
		['2.1.2', 1, ['root', '2', '2.1']],
		['2.1.3', 2, ['root', '2', '2.1']],
		['2.2.1', 0, ['root', '2', '2.2']], // root - 2 - 2.2
		['2.2.2', 1, ['root', '2', '2.2']],
		['2.2.3', 2, ['root', '2', '2.2']],
		['2.3.1', 0, ['root', '2', '2.3']], // root - 2 - 2.3
		['2.3.2', 1, ['root', '2', '2.3']],
		['2.3.3', 2, ['root', '2', '2.3']],
		['3.1.1', 0, ['root', '3', '3.1']], // root - 3 - 3.1
		['3.1.2', 1, ['root', '3', '3.1']],
		['3.1.3', 2, ['root', '3', '3.1']],
		['3.2.1', 0, ['root', '3', '3.2']], // root - 3 - 3.2
		['3.2.2', 1, ['root', '3', '3.2']],
		['3.2.3', 2, ['root', '3', '3.2']],
		['3.3.1', 0, ['root', '3', '3.3']], // root - 3 - 3.3
		['3.3.2', 1, ['root', '3', '3.3']],
		['3.3.3', 2, ['root', '3', '3.3']],
	] as const satisfies Expected

	const actual = new Result()

	visit(getSample(), (node, index, ancestorList) => {
		if (node.type === '1.3') {
			const parent = ancestorList.at(-1)

			if (parent === undefined)
				throw new Error('Parent must be present for non-root nodes')
			if (index === undefined)
				throw new Error('Index must be present for non-root nodes')

			const newNodeList: Nodes[] = [
				{ type: 'new-a' },
				{ type: 'new-b', children: [{ type: 'new-b.1' }] },
			]

			parent.children.splice(index, 1, ...newNodeList)
			return index - 2
		}

		actual.add(node, index, ancestorList)
		return 'CONTINUE'
	})

	t.expect(actual.value).toStrictEqual(expected)
})

describe('should exit when index is out of range', (test) => {
	test('index above range', (t) => {
		const expected = [
			// LEVEl 0 ------------------------------------------

			['root', undefined, []],

			// LEVEL 1 ------------------------------------------

			['1', 0, ['root']],
			['2', 1, ['root']],
			['3', 2, ['root']],

			// LEVEL 2 ------------------------------------------
			['1.1', 0, ['root', '1']], // root - 1
			['1.2', 1, ['root', '1']],
			['1.3', 2, ['root', '1']],
			['2.1', 0, ['root', '2']], // root - 2
		] as const satisfies Expected

		const actual = new Result()

		visit(getSample(), (node, index, ancestorList) => {
			if (node.type === '2.2') {
				const parent = ancestorList.at(-1)

				if (parent === undefined)
					throw new Error('Parent must be present for non-root nodes')
				if (index === undefined)
					throw new Error('Index must be present for non-root nodes')

				parent.children.splice(index, 2)
				return index
			}

			actual.add(node, index, ancestorList)
			return 'CONTINUE'
		})

		t.expect(actual.value).toStrictEqual(expected)
	})

	test('index below range', (t) => {
		const expected = [
			// LEVEl 0 ------------------------------------------

			['root', undefined, []],

			// LEVEL 1 ------------------------------------------

			['1', 0, ['root']],
			['2', 1, ['root']],
			['3', 2, ['root']],

			// LEVEL 2 ------------------------------------------
			['1.1', 0, ['root', '1']], // root - 1
			['1.2', 1, ['root', '1']],
			['1.3', 2, ['root', '1']],
			['2.1', 0, ['root', '2']], // root - 2
		] as const satisfies Expected

		const actual = new Result()

		visit(getSample(), (node, index, ancestorList) => {
			if (node.type === '2.2') {
				const parent = ancestorList.at(-1)

				if (parent === undefined)
					throw new Error('Parent must be present for non-root nodes')
				if (index === undefined)
					throw new Error('Index must be present for non-root nodes')

				return index - 100
			}

			actual.add(node, index, ancestorList)
			return 'CONTINUE'
		})

		t.expect(actual.value).toStrictEqual(expected)
	})
})

test('should continue correctly when parent is root', (t) => {
	const expected = [
		// LEVEl 0 ------------------------------------------

		['root', undefined, []],

		// LEVEL 1 ------------------------------------------

		['1', 0, ['root']],
		// ['2', 1, ['root']],
		['new-a', 1, ['root']],
		['new-b', 2, ['root']],
		['3', 3, ['root']],

		// LEVEL 2 ------------------------------------------

		['1.1', 0, ['root', '1']], // root - 1
		['1.2', 1, ['root', '1']],
		['1.3', 2, ['root', '1']],
		['new-b.1', 0, ['root', 'new-b']], // root - new-b
		// ['2.1', 0, ['root', '2']],
		// ['2.2', 1, ['root', '2']],
		// ['2.3', 3, ['root', '2']],
		['3.1', 0, ['root', '3']], // root - 3
		['3.2', 1, ['root', '3']],
		['3.3', 2, ['root', '3']],

		// LEVEL 3 ------------------------------------------

		['1.1.1', 0, ['root', '1', '1.1']], // root - 1 - 1.1
		['1.1.2', 1, ['root', '1', '1.1']],
		['1.1.3', 2, ['root', '1', '1.1']],
		['1.2.1', 0, ['root', '1', '1.2']], // root - 1 - 1.2
		['1.2.2', 1, ['root', '1', '1.2']],
		['1.2.3', 2, ['root', '1', '1.2']],
		['1.3.1', 0, ['root', '1', '1.3']], // root - 1 - 1.3
		['1.3.2', 1, ['root', '1', '1.3']],
		['1.3.3', 2, ['root', '1', '1.3']],
		// ['2.1.1', 0, ['root', '2', '2.1']], // root - 2 - 2.1
		// ['2.1.2', 1, ['root', '2', '2.1']],
		// ['2.1.3', 2, ['root', '2', '2.1']],
		// ['2.2.1', 0, ['root', '2', '2.2']], // root - 2 - 2.2
		// ['2.2.2', 1, ['root', '2', '2.2']],
		// ['2.2.3', 2, ['root', '2', '2.2']],
		// ['2.3.1', 0, ['root', '2', '2.3']], // root - 2 - 2.3
		// ['2.3.2', 1, ['root', '2', '2.3']],
		// ['2.3.3', 2, ['root', '2', '2.3']],
		['3.1.1', 0, ['root', '3', '3.1']], // root - 3 - 3.1
		['3.1.2', 1, ['root', '3', '3.1']],
		['3.1.3', 2, ['root', '3', '3.1']],
		['3.2.1', 0, ['root', '3', '3.2']], // root - 3 - 3.2
		['3.2.2', 1, ['root', '3', '3.2']],
		['3.2.3', 2, ['root', '3', '3.2']],
		['3.3.1', 0, ['root', '3', '3.3']], // root - 3 - 3.3
		['3.3.2', 1, ['root', '3', '3.3']],
		['3.3.3', 2, ['root', '3', '3.3']],
	] as const satisfies Expected

	const actual = new Result()

	visit(getSample(), (node, index, ancestorList) => {
		if (node.type === '2') {
			const parent = ancestorList.at(-1)

			if (parent === undefined)
				throw new Error('Parent must be present for non-root nodes')
			if (index === undefined)
				throw new Error('Index must be present for non-root nodes')

			const newNodeList: Nodes[] = [
				{ type: 'new-a' },
				{ type: 'new-b', children: [{ type: 'new-b.1' }] },
			]

			parent.children.splice(index, 1, ...newNodeList)
			return index
		}

		actual.add(node, index, ancestorList)
		return 'CONTINUE'
	})

	t.expect(actual.value).toStrictEqual(expected)
})

test('should not continue when current node is root', (t) => {
	const expected = [
		// LEVEl 0 ------------------------------------------
		['root', undefined, []],
	] as const satisfies Expected
	const actual = new Result()

	visit(getSample(), (node, index, ancestorList) => {
		actual.add(node, index, ancestorList)
		return 0
	})

	t.expect(actual.value).toStrictEqual(expected)
})
