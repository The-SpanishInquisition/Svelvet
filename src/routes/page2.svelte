<script lang="ts">
	import { Svelvet, Node, Anchor, type Graph } from '$lib';
	import type { AnchorKey, Anchor as AnchorType, CSSColorString, NodeKey } from '$lib/types';
	import Connector from '../example-components/Connector.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
	import { Splitpanes, Pane } from 'svelte-splitpanes';
	import { get, writable, type Writable } from 'svelte/store';
	import Background from '$lib/containers/Background/Background.svelte';
	import { createEdge } from '$lib/utils';
	import { source } from '$lib/stores';
	import DefaultAnchor from '$lib/components/Anchor/DefaultAnchor.svelte';

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

	type TestNode = { id: number; ins: CSSColorString[]; outs: CSSColorString[] };
	let nodes: TestNode[] = [
		{ id: 0, ins: ['pink', 'lightblue'], outs: ['aquamarine'] },
		{ id: 1, ins: ['pink', 'aquamarine'], outs: ['lightblue', 'pink'] },
		{ id: 2, ins: ['lightgreen', 'pink'], outs: ['pink', 'lightgreen'] },
		{ id: 3, ins: [], outs: ['pink'] },
		{ id: 4, ins: ['aquamarine'], outs: [] }
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

	async function dataTypeChecker(a: string, b: string): Promise<boolean> {
		await new Promise((resolve) => setTimeout(resolve, 100));
		return a === b;
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
				{dataTypeChecker}
				on:connection={(e) => console.log('CONNECTION', e)}
				on:disconnection={(e) => console.log('DISCONNECTION', e)}
			>
				{#each nodes as node}
					<Node
						useDefaults
						width={200}
						height={100}
						borderWidth="2px"
						inputs={5}
						id="n-{node.id}"
						position={{ x: Math.random() * 500, y: Math.random() * 800 }}
					>
						<div class="anchorIn">
							{#each node.ins as inAnchor}
								<span>
									<Anchor
										input
										dataType={inAnchor}
										bgColor={inAnchor || 'grey'}
										let:hovering
										let:connecting
										let:linked
									>
										{#if hovering}
											<div class="anchorTooltip">
												{inAnchor}
											</div>
										{/if}
										<DefaultAnchor
											input={true}
											output={false}
											{connecting}
											hovering={false}
											bgColor={inAnchor || 'grey'}
											connected={false}
										/>
									</Anchor>
								</span>
							{/each}
						</div>
						<div class="anchorOut">
							{#each node.outs as outAnchor}
								<span>
									<Anchor
										output
										dataType={outAnchor}
										bgColor={outAnchor || 'grey'}
										let:hovering
										let:connecting
										let:linked
									>
										{#if hovering}
											<div class="anchorTooltip">
												{outAnchor}
											</div>
										{/if}
										<DefaultAnchor
											input={false}
											output={true}
											{connecting}
											hovering={false}
											bgColor={outAnchor || 'grey'}
											connected={false}
										/>
									</Anchor>
								</span>
							{/each}
						</div>
					</Node>
				{/each}
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

<!-- <Svelvet
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
</Svelvet> -->

<style>
	.anchorIn {
		position: absolute;
		left: 10px;
	}
	.anchorOut {
		position: absolute;
		right: 10px;
	}
	.anchorIn span {
		padding: 0px;
		margin: 0.1em;
	}
	.anchorOut span {
		padding: 0px;
		margin: 0.1em;
	}
	.anchorTooltip {
		position: absolute;
		background: #444444;
		color: white;
		border-radius: 2px;
		padding: 0.2em;
		top: -1.5em;
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
