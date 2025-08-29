import { test } from 'vitest'
import { visit } from '../../src/unist-util-visit-siblings-first.ts'
import { Result } from '../create-result.ts'
import { getSample } from '../sample.ts'
import type { Expected } from '../types.ts'

test('should skip child nodes when action is SKIP', (t) => {
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
		// ['2.1', 0, ['root', '2']], // root - 2
		// ['2.2', 1, ['root', '2']],
		// ['2.3', 2, ['root', '2']],
		['3.1', 0, ['root', '3']], // root - 3
		['3.2', 1, ['root', '3']],
		['3.3', 2, ['root', '3']],

		// LEVEL 3 ------------------------------------------

		// ['1.1.1', 0, ['root', '1', '1.1']], // root - 1 - 1.1
		// ['1.1.2', 1, ['root', '1', '1.1']],
		// ['1.1.3', 2, ['root', '1', '1.1']],
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
		actual.add(node, index, ancestorList)
		switch (node.type) {
			case '2':
			case '1.1':
				return 'SKIP'
			default:
				return 'CONTINUE'
		}
	})

	t.expect(actual.value).toStrictEqual(expected)
})
