import type * as Unist from 'unist'
import Queue from 'yocto-queue'

/**
 * Traverses a unist AST in [breadth-first] order. Visits siblings before
 * descending to children.
 *
 * The {@linkcode visitor} receives the node, its index in the parent's children
 * (`undefined` for root), and the array of ancestor nodes from root to parent.
 *
 * [breadth-first]: https://github.com/syntax-tree/unist?tab=readme-ov-file#breadth-first-traversal
 *
 * @param tree - The root node of the unist AST.
 * @param visitor - Callback invoked for each node. Return {@link EXIT} to stop
 *                  traversal, {@link SKIP} to skip subtree, {@link CONTINUE} or
 *                  nothing to proceed.
 * @return Nothing.
 *
 * @example
 * import { visit } from "unist-util-visit-siblings";
 *
 * visit(tree, (node) => {
 *   console.dir(node, { depth: null });
 * });
 */
export function visit<T extends Parent>(tree: T, visitor: Visitor<T>): void {
	const queue = new Queue<QueueItem>()
	queue.enqueue({ node: tree, index: undefined, ancestors: [] })

	while (true) {
		const item = queue.dequeue()
		if (item === undefined) return

		const result = visitor(item.node, item.index, item.ancestors)
		switch (result) {
			case EXIT:
				return
			case SKIP:
				continue
		}

		if (!('children' in item.node) || !Array.isArray(item.node.children))
			continue

		// Copy to avoid mutating shared arrays.
		const ancestors = item.ancestors.concat(item.node)
		for (let i = 0; i < item.node.children.length; i++) {
			queue.enqueue({ node: item.node.children[i], index: i, ancestors })
		}
	}
}

/**
 * Visitor callback invoked for each visited node.
 *
 * @param node - The current node (root or a child).
 * @param index - Index of `node` in its parent's children, or `undefined` for root.
 * @param ancestors - Ancestor nodes from root to parent.
 * @returns Either an {@linkcode Action} to control traversal, or nothing (`void`).
 */
export type Visitor<T extends Parent> = (
	node: Nodes<T>,
	index: number | undefined,
	ancestors: Parent[],
) =>
	| Action
	// biome-ignore lint/suspicious/noConfusingVoidType: void is valid for return type.
	| void

/** Constant for signaling the traversal to exit early. */
export const EXIT = 'EXIT'
/** Constant for signaling the traversal to continue. */
export const CONTINUE = 'CONTINUE'
/** Constant for signaling to skip the subtree (children and descendants). */
export const SKIP = 'SKIP'
/** Type for actions returned by the {@linkcode Visitor} callback. */
export type Action = typeof EXIT | typeof CONTINUE | typeof SKIP

/** Union of a parent node `T` and its child nodes. */
export type Nodes<T extends Parent = Parent> = T | T['children'][number]
/** unist node that contains other nodes (children). */
export interface Parent extends Unist.Parent {
	children: (Unist.Node | Unist.Parent | Unist.Literal)[]
}

/** Item stored in the queue during traversal. */
interface QueueItem {
	node: Nodes
	index: number | undefined
	ancestors: Parent[]
}
