/**
 * source: https://www.npmjs.com/package/unist-util-visit-parents?activeTab=code
 * at: /unist-util-visit-parents/lib/index.d.ts
 * version: 6.0.1
 */

import type * as Unist from 'unist'

export type { Ancestor, InclusiveDescendant, Matches }

/**
 * Collect nodes in `Tree` that can be ancestors of `Child`.
 */
type Ancestor<
	Tree extends Unist.Node,
	Child extends Unist.Node,
> = InternalAncestor<InclusiveDescendant<Tree>, Child>

/**
 * Collect nodes in `Tree` that can be ancestors of `Child`.
 */
type InternalAncestor<
	Node extends Unist.Node,
	Child extends Unist.Node,
	Max extends Uint = 10,
	Depth extends Uint = 0,
> = Depth extends Max
	? never
	:
			| InternalParent<Node, Child>
			| InternalAncestor<
					Node,
					InternalParent<Node, Child>,
					Max,
					Increment<Depth>
			  >

/**
 * Collect nodes that can be parents of `Child`.
 */
type InternalParent<
	Node extends Unist.Node,
	Child extends Unist.Node,
> = Node extends Unist.Parent
	? Node extends {
			children: (infer Children)[]
		}
		? Child extends Children
			? Node
			: never
		: never
	: never

/**
 * Collect all (inclusive) descendants of `Tree`.
 *
 * > 👉 **Note**: for performance reasons, this seems to be the fastest way to
 * > recurse without actually running into an infinite loop, which the
 * > previous version did.
 * >
 * > Practically, a max of `2` is typically enough assuming a `Root` is
 * > passed, but it doesn’t improve performance.
 * > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
 * > Using up to `10` doesn’t hurt or help either.
 */
type InclusiveDescendant<
	Tree extends Unist.Node,
	Max extends Uint = 10,
	Depth extends Uint = 0,
> = Tree extends Unist.Parent
	? Depth extends Max
		? Tree
		:
				| Tree
				| InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
	: Tree

/**
 * Check whether a node matches a check in the type system.
 */
type Matches<Value, Check> = Check extends Array<unknown>
	? MatchesOne<Value, Check[keyof Check]>
	: MatchesOne<Value, Check>

/**
 * Check whether a node matches a primitive check in the type system.
 */
type MatchesOne<Value, Check> = Check extends null | undefined
	? Value
	: Value extends { type: Check }
		? Value
		: Value extends Check
			? Value
			: Check extends (...rest: unknown[]) => unknown
				? Predicate<Check, Value> extends Value
					? Predicate<Check, Value>
					: never
				: never

/**
 * Get the value of a type guard `Fn`.
 */
type Predicate<Fn, Fallback> = Fn extends (
	value: unknown,
) => value is infer Thing
	? Thing
	: Fallback

/**
 * Increment a number in the type system.
 */
type Increment<I extends Uint = 0> = I extends 0
	? 1
	: I extends 1
		? 2
		: I extends 2
			? 3
			: I extends 3
				? 4
				: I extends 4
					? 5
					: I extends 5
						? 6
						: I extends 6
							? 7
							: I extends 7
								? 8
								: I extends 8
									? 9
									: 10

/**
 * Number; capped reasonably.
 */
type Uint = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
