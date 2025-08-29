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

[`visit`](#visittree-visitor-options) walks a unist tree in [breadth-first] order. It visits all siblings at a level first, then moves down to the next level.

## Usage

```ts
import type {Parent} from "unist-util-visit-siblings-first";
import {visit} from "unist-util-visit-siblings-first";

const tree: Parent = {
	type: "root",
	children: [
		{type: "1", children: [{type: "1.1"}, {type: "1.2"}]},
		{type: "2", children: [{type: "2.1"}, {type: "2.2"}]},
	],
};

visit(tree, (node, i, ancestors) => {
	const ancestorTypes = ancestors.map((el) => el.type).join(", ");
	console.log(`type: ${node.type}, index: ${i}, ancestors: [${ancestorTypes}]`);
	return "CONTINUE";
});
```

Output:
```txt
type: root, index: undefined, ancestors: []
type: 1, index: 0, ancestors: [root]
type: 2, index: 1, ancestors: [root]
type: 1.1, index: 0, ancestors: [root, 1]
type: 1.2, index: 1, ancestors: [root, 1]
type: 2.1, index: 0, ancestors: [root, 2]
type: 2.2, index: 1, ancestors: [root, 2]
```

Traversal order for the example above:
1. `root`.
2. `1`, `2` (siblings at same level).
3. `1.1`, `1.2`, `2.1`, `2.2` (children level).

#### Example: skip subtree and exit

```ts
visit(tree, (node) => {
  // Don't visit 1.1 and 1.2.
  if (node.type === "1") return "SKIP";
  // Stop traversal completely.
  if (node.type === "1.1") return "EXIT";
	return "CONTINUE";
});
```

#### Example: remove node

```ts
visit(tree, (node, index, ancestors) => {
	if (node.type === "2.1") {
		const parent = ancestors.at(-1);
		if (!parent || typeof index !== "number") return "CONTINUE";

		// Remove current node.
		parent.children.splice(index, 1);

		// IMPORTANT: return the index of the modified sibling
		// so traversal resumes correctly.
		return index;
	}
	return "CONTINUE";
});
```

#### Example: replace previous sibling and current node

```ts
visit(tree, (node, index, ancestors) => {
	if (node.type === '2.2') {
		const parent = ancestors.at(-1);
		if (!parent || typeof index !== "number") return "CONTINUE";

		const newNode = { type: "new-node", value: "Hello, world!"};

		// Replace the previous sibling and the current node.
		parent.children.splice(index - 1, 2, newNode);

		// IMPORTANT: return the index of the modified sibling
		// so traversal resumes correctly.
		return index - 1;
	}
	return "CONTINUE";
});
```

## API

### `visit(tree, visitor, options)`

Traverses a unist AST in [breadth-first] order.
Visits siblings before descending to children.

#### Parameters
- `tree` — the root node of a compatible unist AST.
- [`visitor`](#visitornode-index-ancestors) — callback invoked for each node.
- `options` — optional configs.

#### Returns
Nothing.

### `visitor(node, index, ancestors)`

Callback invoked for each node.

The `visitor` receives the node, its index in
the parent's children, and the array of ancestor nodes from root to parent.

**NOTE**:

When a visitor modifies a **sibling**, it must return
the index of the changed sibling.
Otherwise you may encounter unexpected behavior.

If you only modify the current node or its children, returning an index is not required.

#### Parameters
- `node` — a compatible unist AST node.
- `index` — number index of `node` in parent's `children`, or `undefined` for root.
- `ancestors` — array of ancestor `Parent` nodes from root to parent.

#### Returns

It must return one of:
- `"EXIT"` to stop traversal,
- `"SKIP"` to skip subtree (children),
- `"CONTINUE"` to	continue, or
- an index number to resume traversal at that index.

### `Options`

Options for the visit function.

#### `test`

Optional test to filter nodes before visiting.

Uses the [Test] from [unist-util-is] to check if a node should be visited.
If provided, only nodes passing the test will invoke the visitor.

Example:
```ts
visit(
  tree,
  (node) => {
    console.log('node type is "text"');
    return "CONTINUE";
  },
  { test: "text" }
);
```

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
[Test]: https://github.com/syntax-tree/unist-util-is?tab=readme-ov-file#test
[unist]: https://github.com/syntax-tree/unist
[unist-util-is]: https://github.com/syntax-tree/unist-util-is
[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
[unist-util-visit-parents]: https://github.com/syntax-tree/unist-util-visit-parents