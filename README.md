# unist-util-visit-siblings-first

[Breadth-first][breadth-first] traversal for unist ASTs — visits siblings before descending into children.

## Installation

```sh
# deno
deno add npm:unist-util-visit-siblings-first
# bun
bun add unist-util-visit-siblings-first
# pnpm
pnpm add unist-util-visit-siblings-first
# yarn
yarn add unist-util-visit-siblings-first
# npm
npm install unist-util-visit-siblings-first
```

## What it does

[`visit`](#visittree-visitor) walks a unist tree in [breadth-first] order. It visits all siblings at a level first, then moves down to the next level.

## Usage

```ts
import type {Parent} from "unist-util-visit-siblings-first";
import {visit} from "unist-util-visit-siblings-first";

const tree: Parent = {
	type: "root",
	children: [
		{type: "a", children: [{type: "a1"}, {type: "a2"}]},
		{type: "b", children: [{type: "b1"}]},
	],
};

visit(tree, (node, i, ancestors) => {
	const ancestorTypes = ancestors.map((el) => el.type).join(", ");
	console.log(`type: ${node.type}, index: ${i}, ancestors: [${ancestorTypes}]`);
});
```

Output:
```txt
type: root, index: undefined, ancestors: []
type: a, index: 0, ancestors: [root]
type: b, index: 1, ancestors: [root]
type: a1, index: 0, ancestors: [root, a]
type: a2, index: 1, ancestors: [root, a]
type: b1, index: 0, ancestors: [root, b]
```

Traversal order for the example above:
1. `root`.
2. `a`, `b` (siblings at same level).
3. `a1`, `a2`, `b1` (children level).

#### Example: skip subtree and exit

```ts
visit(tree, (node) => {
  if (node.type === "a") return SKIP;   // don't visit a1, a2
  if (node.type === "b1") return EXIT;  // stop traversal completely
});
```

## API

### `visit(tree, visitor)`

```ts
export function visit<T extends Parent>(tree: T, visitor: Visitor<T>): void
```

Parameters: 
- `tree` — root `Parent` node.
- `visitor` — called for each visited node.

### `visitor(node, index, ancestors)`

```ts
export type Visitor<T extends Parent> = (
  node: Nodes<T>,
  index: number | undefined,
  ancestors: Parent[],
) => Action | void;
```

- `node` — either the root `T` or `T`'s children.
- `index` — number index of `node` in parent's `children`, or `undefined` for root.
- `ancestors` — array of ancestor `Parent` nodes from root to parent.

### `Action`

```ts
type Action = typeof EXIT | typeof CONTINUE | typeof SKIP
```

Type for actions returned by the [`Visitor`](#visitornode-index-ancestors) callback.

- `EXIT` — stop traversal immediately.
- `SKIP` — skip the current node’s subtree (children and descendants).
- `CONTINUE` — continue traversal (same as returning nothing).

## Related

- [`@flex-development/unist-util-visit`][@flex-development/unist-util-visit] — [postorder] walk the tree with a stack of parents.
- [`unist-util-visit`][unist-util-visit] — walk the tree with one parent.
- [`unist-util-visit-parents`][unist-util-visit-parents] — walk the tree with a stack of parents.

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT


[@flex-development/unist-util-visit]: https://github.com/flex-development/unist-util-visit
[breadth-first]: https://github.com/syntax-tree/unist?tab=readme-ov-file#breadth-first-traversal
[postorder]: https://github.com/syntax-tree/unist#postorder
[unist]: https://github.com/syntax-tree/unist
[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
[unist-util-visit-parents]: https://github.com/syntax-tree/unist-util-visit-parents