/**
 * source: https://www.npmjs.com/package/unist-util-visit-parents?activeTab=code
 * at: /unist-util-visit-parents/lib/index.d.ts
 * version: 6.0.1
 */

import type * as Unist from 'unist'
import type { Test } from 'unist-util-is'
import type {
	Ancestor,
	InclusiveDescendant,
	Matches,
} from './visitor-internal.type.ts'

export type {
	BuildVisitor,
	Visitor,
	VisitorResult,
	Exit,
	Continue,
	Skip,
	Index,
}

/**
 * Build a typed `Visitor` function from a tree and a test.
 *
 * It will infer which values are passed as `node` and which as `parents`.
 */
type BuildVisitor<
	Tree extends Unist.Node = Unist.Node,
	Check extends Test = Test,
> = Visitor<
	Matches<InclusiveDescendant<Tree>, Check>,
	Ancestor<Tree, Matches<InclusiveDescendant<Tree>, Check>>
>

/**
 * Handle a node (matching `test`, if given).
 *
 * Visitors are free to transform `node`.
 * They can also transform the parent of node (the last of `ancestors`).
 *
 * Replacing `node` itself, if `SKIP` is not returned, still causes its
 * descendants to be walked (which is a bug).
 *
 * When a visitor modifies a sibling, it must return the changed sibling's
 * index. Otherwise, you may encounter unexpected behavior.
 *
 * If you only modify the current node or its children, returning an index is
 * not required.
 *
 * For more information, visit our [documentation][doc].
 *
 * [doc]: https://github.com/unigramjs/unist-util-visit-siblings-first/blob/main/README.md
 */
type Visitor<
	Visited extends Unist.Node = Unist.Node,
	VisitedParents extends Unist.Parent = Unist.Parent,
> = (
	node: Visited,
	index: number | undefined,
	ancestors: Array<VisitedParents>,
) => VisitorResult

/**
 * Any value that can be returned from a visitor.
 */
type VisitorResult = Exit | Continue | Skip | Index

/** Signaling the traversal to exit early. */
type Exit = 'EXIT'
/** Signaling the traversal to continue. */
type Continue = 'CONTINUE'
/**
 * Signaling to skip the subtree (children and descendants).
 *
 * Replacing `node` itself, if {@linkcode Skip} is not returned, still causes
 * its descendants to be walked (which is a bug).
 */
type Skip = 'SKIP'
/**
 * Continue traversal at the sibling at {@linkcode Index}.
 *
 * When a visitor modifies a sibling, it must return the changed sibling's
 * index. Otherwise, you may encounter unexpected behavior.
 *
 * If you only modify the current node or its children, returning an index is
 * not required.
 *
 * For more information, visit our [documentation][doc].
 *
 * [doc]: https://github.com/unigramjs/unist-util-visit-siblings-first/blob/main/README.md
 */
type Index = number
