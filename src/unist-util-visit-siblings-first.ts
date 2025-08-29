import type * as Unist from 'unist'
import type { Test } from 'unist-util-is'
import { convert } from 'unist-util-is'
import type { Options } from './types/visit.type.ts'
import type { BuildVisitor, VisitorResult } from './types/visitor.type.ts'
import type {
	Ancestor,
	InclusiveDescendant,
	Matches,
} from './types/visitor-internal.type.ts'

/**
 * Traverses a unist AST in [breadth-first] order.
 * Visits siblings before descending to children.
 *
 * The {@linkcode visitor} receives the node, its index in
 * the parent's children, and the array of ancestor nodes from root to parent.
 *
 * {@linkcode visitor} must return one of:
 * - `"EXIT"` to stop traversal,
 * - `"SKIP"` to skip subtree (children),
 * - `"CONTINUE"` to	continue, or
 * - an index number to resume traversal at that index.
 *
 * **NOTE**:
 *
 * When a {@linkcode visitor} modifies a **sibling**, it must return
 * the index of the changed sibling. Otherwise you may encounter unexpected
 * behavior.
 *
 * If you only modify the current node or its children, returning an index is
 * not required.
 *
 * For more information, visit our [documentation][doc].
 *
 * [breadth-first]: https://github.com/syntax-tree/unist?tab=readme-ov-file#breadth-first-traversal
 * [doc]: https://github.com/unigramjs/unist-util-visit-siblings-first/blob/main/README.md
 *
 * @param tree - The root node of the unist AST.
 * @param visitor - Callback invoked for each node.
 * @param options - Optional configs.
 * @return Nothing.
 *
 * @example
 * ```ts
 * import type {Parent} from "unist-util-visit-siblings-first";
 * import { visit } from "unist-util-visit-siblings";
 *
 * const tree: Parent = {
 *   type: "root",
 *   children: [
 *     {type: "text", value: "Hello, world!"},
 *   ],
 * };
 *
 * visit(tree, (node) => {
 *   console.dir(node, { depth: null });
 *   return "CONTINUE";
 * });
 * ```
 */
export function visit<Tree extends Unist.Node, Check extends Test>(
	tree: Tree,
	visitor: BuildVisitor<Tree, Check>,
	options?: Options<Check>,
): void {
	type VisitedNode = Matches<InclusiveDescendant<Tree>, Check>
	type VisitedAncestor = Ancestor<Tree, VisitedNode>

	interface QueueItem {
		node: VisitedNode
		index: number | undefined
		ancestorList: VisitedAncestor[]
	}

	interface NextLevelQueueItem extends QueueItem {
		index: number
	}

	const test = convert(options?.test)
	let queue: QueueItem[] = []
	let nextLevelQueue: NextLevelQueueItem[] = []
	let visitorAction: VisitorResult = 'CONTINUE'
	const nodeIndexMap = new WeakMap<VisitedNode, number | undefined>()

	queue.push({
		node: tree as VisitedNode,
		index: undefined,
		ancestorList: [],
	})

	let queueIndex = 0
	let queueLength = queue.length
	while (queueIndex < queueLength) {
		const { node, index, ancestorList } = queue[queueIndex]
		nodeIndexMap.set(node, index)
		if (test(node)) visitorAction = visitor(node, index, ancestorList)

		if (typeof visitorAction === 'number') {
			const continueAtIndex = visitorAction

			const parent = ancestorList[ancestorList.length - 1] as
				| Unist.Parent
				| undefined
			// Exit at the root node (the root has no parent, so this doesn't apply).
			if (parent === undefined) return

			const childrenLength = parent.children.length
			// Out of range. Nothing to continue.
			if (continueAtIndex < 0 || continueAtIndex >= childrenLength) return

			// ------------------- Recalculate the main queue ------------------------
			const newQueue: QueueItem[] = []
			let parentQueueIndex: number | undefined
			/** Whether to skip nodes that share the same parent. */
			let shouldSkip: boolean = false
			// Keep the previous queue. Replace current parent's children
			// with the new children.
			for (let i = 0; i < queueLength; i++) {
				const item = queue[i]
				const itemParent = item.ancestorList[item.ancestorList.length - 1]

				if (itemParent === parent) {
					if (shouldSkip) continue

					for (let j = 0; j < childrenLength; j++) {
						newQueue.push({
							node: parent.children[j] as VisitedNode,
							index: j,
							ancestorList,
						})
					}
					// Set to `true` because the parent's children have already been
					// replaced by the new children.
					shouldSkip = true
					parentQueueIndex = i
					continue
				}

				newQueue.push(item)
			}

			// Adjust the main-queue loop conditions.
			queue = newQueue
			// biome-ignore lint/style/noNonNullAssertion: the index cannot be undefined.
			queueIndex = parentQueueIndex! + continueAtIndex
			queueLength = queue.length

			// ------------------ Recalculate the next-level queue. ------------------
			const newNextLevelQueue = []
			const nextLevelQueueLength = nextLevelQueue.length
			for (let i = 0; i < nextLevelQueueLength; i++) {
				const item = nextLevelQueue[i]
				const itemParent = item.ancestorList[item.ancestorList.length - 1]
				const itemAncestor = item.ancestorList[
					item.ancestorList.length - 2
				] as Unist.Parent

				if (itemAncestor === parent) {
					const itemParentIndex = nodeIndexMap.get(itemParent as VisitedNode)
					// biome-ignore lint/style/noNonNullAssertion: the index cannot be undefined.
					if (itemParentIndex! < continueAtIndex) {
						newNextLevelQueue.push(item)
					} else {
						break
					}
				} else {
					newNextLevelQueue.push(item)
				}
			}
			nextLevelQueue = newNextLevelQueue
		} else {
			switch (visitorAction) {
				case 'EXIT':
					return
				case 'SKIP':
					break
				default: {
					if ('children' in node && Array.isArray(node.children)) {
						// Copy to avoid mutating shared arrays.
						const newAncestors = ancestorList.concat(node as VisitedAncestor)
						for (let i = 0; i < node.children.length; i++) {
							nextLevelQueue.push({
								node: node.children[i],
								index: i,
								ancestorList: newAncestors,
							})
						}
					}
					break
				}
			}

			queueIndex++
			// Finished processing the current level.
			// Prepare to traverse the next level.
			if (queueIndex === queueLength) {
				queue = nextLevelQueue
				nextLevelQueue = []
				queueLength = queue.length
				queueIndex = 0
			}
		}

		// Reset visitorAction for the next iteration.
		visitorAction = 'CONTINUE'
	}
}
