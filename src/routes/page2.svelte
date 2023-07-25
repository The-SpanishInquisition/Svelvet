<script lang="ts">
	import { Svelvet, Node, Anchor, type Graph } from '$lib';
	import type { AnchorKey, Anchor as AnchorType, NodeKey } from '$lib/types';
	import Connector from '../example-components/Connector.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
	import { Splitpanes, Pane } from 'svelte-splitpanes';
	import { get, writable, type Writable } from 'svelte/store';
	import Background from '$lib/containers/Background/Background.svelte';
	import { createEdge } from '$lib/utils';
	import { source } from '$lib/stores';

	let totalNodes = 0;
	let widthCount = 1;

	let graphData: Graph;

	$: translation = graphData?.transforms?.translation;
	$: zoom = graphData?.transforms?.scale;

	// Updates the connected anchors set on source and target
	// Creates the edge and add it to the store
	function connectAnchors(source: AnchorType, target: AnchorType) {
		// if (edgeStyle) edgeConfig.type = edgeStyle;
		// const newEdge = createEdge({ source, target }, source?.edge || null, edgeConfig);
		// if (!source.node || !target.node) return false;
		// edgeStore.add(newEdge, new Set([source, target, source.node, target.node]));
		// return true;
	}

	let resetGraph = true;

	let nodes = [
		{ id: 0 }, // conns: writable(['n-1']), },
		{ id: 1 }, // conns: writable([]), },
		{ id: 2 }, // conns: writable([]), },
		{ id: 3 }, // conns: writable([]), },
		{ id: 4 } // conns: writable([]), },
	];

	let connectAnchorIds: (
		sourceNode: NodeKey,
		sourceAnchor: AnchorKey,
		targetNode: NodeKey,
		targetAnchor: AnchorKey
	) => boolean;
	let clearAllGraphEdges: () => void;

	function addRandomConn() {
		const node1 = Math.floor(Math.random() * 5);
		let node2 = node1;
		while (node1 == node2) node2 = Math.floor(Math.random() * 5);

		if (connectAnchorIds) {
			const res = connectAnchorIds(`N-n-${node1}`, `A-a-${node1}`, `N-n-${node2}`, `A-a-${node2}`);
			console.log('RES', res);
		}
	}

	function clearEdges() {
		if (clearAllGraphEdges) {
			clearAllGraphEdges();
		}
	}
</script>

<body>
	{#key translation}
		{#if translation}
			{JSON.stringify($translation)}
			{JSON.stringify($zoom)}
		{/if}
	{/key}
	<button style:float="right" on:click={addRandomConn}>Add random conn</button>
	<button style:float="right" on:click={clearEdges}>Clear edges</button>
	<Splitpanes on:resize={() => window.dispatchEvent(new Event('resize'))}>
		<Pane>
			<Svelvet
				id="asdf"
				minimap
				title="test"
				snapTo={10}
				on:edgeDrop={(e) => console.log('EDGE DROP', e)}
			>
				<Connector />
				<Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }}>
					<button on:click={() => widthCount++} />
					{#each { length: widthCount } as item}
						<div>Height</div>
					{/each}
				</Node>
				<Node inputs={5} position={{ x: 600, y: 600 }} />
				<Node useDefaults dimensions={{ width: 400, height: 300 }} position={{ x: 100, y: 300 }}>
					<div class="anchor">
						<Anchor nodeConnect />
					</div>
					<Anchor nodeConnect />
				</Node>
				{#each { length: totalNodes } as node}
					<Node useDefaults position={{ x: Math.random() * 200, y: Math.random() * 400 }} />
				{/each}
				<ThemeToggle slot="toggle" />
				<Background dotColor="red" slot="background" />
			</Svelvet>
		</Pane>
		<Pane>
			<Svelvet
				id="asdf2"
				minimap
				title="test"
				snapTo={10}
				bind:graph={graphData}
				bind:connectAnchorIds
				bind:clearAllGraphEdges
			>
				<!-- on:connection={(e) => console.log('CONNECTION', e)} -->
				<!-- on:disconnection={(e) => console.log('DISCONNECTION', e)} -->
				<!-- Special anchor for accessing connection functions -->
				<div class="hidden" />
				{#each nodes as node}
					<!-- {#key resetGraph} -->
					<Node
						id="n-{node.id}"
						useDefaults
						dimensions={{ width: 50, height: 40 }}
						position={{ x: Math.random() * 500, y: Math.random() * 800 }}
						inputs={4}
					>
						<Anchor nodeConnect id="a-{node.id}" />
						<!-- connections={get(node.conns)} -->
						<!-- connections={[[`n-${(node.id+1)%5}`, `a-${(node.id+1)%5}`]]} -->
					</Node>
					<!-- {/key} -->
				{/each}
				<ThemeToggle slot="toggle" />
				<Background dotColor="blue" slot="background" />
			</Svelvet>
		</Pane>
	</Splitpanes>
</body>

<style>
	.anchor {
		position: absolute;
		right: 10px;
	}
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
	table {
		width: 100%;
		height: 100%;
		padding: 0px;
	}
	td {
		border: 1px solid black;
		height: 100%;
		margin: 0px;
		padding: 0px;
	}
	:root[theme='dark'] {
		--background-color: black;
		--node-color: white;
	}
	:root[theme='light'] {
		--background-color: purple;
		--node-color: green;
	}

	.hidden {
		visibility: hidden;
	}
</style>
