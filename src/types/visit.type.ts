import type { Test } from 'unist-util-is'

/** Options for the visit function. */
export interface Options<Check extends Test> {
	/**
	 * Optional test to filter nodes before visiting.
	 *
	 * Uses the [Test] from [unist-util-is] to check if a node should be visited.
	 * If provided, only nodes passing the test will invoke the visitor.
	 *
	 * [Test]: https://github.com/syntax-tree/unist-util-is?tab=readme-ov-file#test
	 * [unist-util-is]: https://github.com/syntax-tree/unist-util-is
	 *
	 * @example
	 * ```ts
	 * visit(
	 *   tree,
	 *   (node) => {
	 *     console.log('node type is "text"');
	 *     return "CONTINUE";
	 *   },
	 *   { test: "text" }
	 * );
	 * ```
	 */
	test?: Check
}
