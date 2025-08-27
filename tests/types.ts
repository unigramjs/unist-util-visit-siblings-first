import type * as Unist from 'unist'

export type Nodes = Parent | Unist.Node

export interface Parent extends Unist.Parent {
	children: Nodes[]
}

export type Expected = [string, number | undefined, string[]][]
