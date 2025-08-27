import type { Node } from 'unist'
import type { Expected, Parent } from './types.ts'

export class Result {
	#result: Expected = []

	add(
		node: Node | Parent,
		index: number | undefined,
		ancestorList: Parent[],
	): void {
		const ancestorTypeList = ancestorList.map((el) => el.type)
		this.#result.push([node.type, index, ancestorTypeList])
	}

	get value(): Expected {
		return this.#result
	}
}
