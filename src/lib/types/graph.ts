import type { Writable } from 'svelte/store';
import type { GraphKey, NodeStore, DataStore, Node } from '.';

export interface Graph {
	id: GraphKey;
	nodes: NodeStore;
	transforms: GraphTransforms;
	data: DataStore;
	isLocked: Writable<boolean>;
	bounds: {
		top: Writable<number>;
		left: Writable<number>;
		right: Writable<number>;
		bottom: Writable<number>;
	};
	connectingFrom: Writable<Node | null>;
	groups: Writable<Groups>;
	edges: Writable<Edges>;
}

export type Edges = Map<Node, Array<Connection>>;

export interface Connection {
	anchorId: string;
	targetNode: Node;
}

export interface Groups {
	selected: Writable<Set<Node>>;
	[key: string]: Writable<Set<Node>>;
}

export interface GraphTransforms {
	translation: {
		x: Writable<number>;
		y: Writable<number>;
	};
	scale: Writable<number>;
	cursor: {
		x: Writable<number>;
		y: Writable<number>;
	};
}