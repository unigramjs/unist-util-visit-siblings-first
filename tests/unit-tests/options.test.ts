import { test } from 'vitest'
import { visit } from '../../src/unist-util-visit-siblings-first.ts'
import { Result } from '../create-result.ts'
import { getSample } from '../sample.ts'
import type { Expected } from '../types.ts'

test('should match test option', (t) => {
	const expected = [['1.2', 1, ['root', '1']]] as const satisfies Expected

	const actual = new Result()

	visit(
		getSample(),
		(node, index, ancestorList) => {
			actual.add(node, index, ancestorList)
			return 'CONTINUE'
		},
		{ test: '1.2' },
	)

	t.expect(actual.value).toStrictEqual(expected)
})
