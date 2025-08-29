import { test } from 'vitest'
import { visit } from '../../src/unist-util-visit-siblings-first.ts'
import { Result } from '../create-result.ts'
import { getSample } from '../sample.ts'
import type { Expected } from '../types.ts'

test('should stop traversal when action is EXIT', (t) => {
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
	] as const satisfies Expected

	const actual = new Result()

	visit(getSample(), (node, index, ancestorList) => {
		actual.add(node, index, ancestorList)
		if (node.type === '1.2') return 'EXIT'
		return 'CONTINUE'
	})

	t.expect(actual.value).toStrictEqual(expected)
})
