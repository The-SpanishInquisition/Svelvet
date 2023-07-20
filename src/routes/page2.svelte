<script lang="ts">
	import { Svelvet, Node, Anchor, type Graph } from '$lib';
	import Connector from '../example-components/Connector.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
	import { Splitpanes, Pane } from 'svelte-splitpanes';
	import { get } from 'svelte/store';
	import Background from '$lib/containers/Background/Background.svelte';

	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		totalNodes++;
	}
	let totalNodes = 0;
	let widthCount = 1;

	let graphData: Graph;

	$: translation = graphData?.transforms?.translation;
	$: zoom = graphData?.transforms?.scale;
</script>

<body>
	{#key translation}
		{#if translation}
			{JSON.stringify($translation)}
			{JSON.stringify($zoom)}
		{/if}
	{/key}
	<Splitpanes on:resize={() => window.dispatchEvent(new Event('resize'))}>
		<Pane>
			<Svelvet
				id="asdf"
				minimap
				title="test"
				snapTo={10}
				bind:graph={graphData}
				on:edgeDrop={(e) => console.log('EDGE DROP', e)}
			>
				<!-- on:connection={(e) => console.log('CONNECTION', e)} -->
				<!-- on:disconnection={(e) => console.log('DISCONNECTION', e)} -->
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
					<Node
						let:connect
						useDefaults
						position={{ x: Math.random() * 200, y: Math.random() * 400 }}
					/>
				{/each}
				<ThemeToggle slot="toggle" />
				<Background dotColor="red" slot="background" />
			</Svelvet>
		</Pane>
		<Pane>
			<Svelvet id="asdf2" minimap title="test" snapTo={10}>
				<Connector />
				<Node inputs={5} position={{ x: 600, y: 600 }} />
				<Node useDefaults dimensions={{ width: 400, height: 300 }} position={{ x: 100, y: 300 }}>
					<div class="anchor">
						<Anchor nodeConnect id="a1"/>
					</div>
					<Anchor nodeConnect id="a2" />
				</Node>
				{#each { length: totalNodes } as node}
					<Node
						let:connect
						useDefaults
						position={{ x: Math.random() * 200, y: Math.random() * 400 }}
					/>
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
</style>
