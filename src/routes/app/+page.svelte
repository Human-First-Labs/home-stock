<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<div class="section column">
	<h1>Welcome to HomeStock</h1>
	{#if data.currentScan}
		<p>Current Scan: {data.currentScan.lines.length} items</p>
	{/if}
	<a class="basic-a" href="/app/scan">
		<button class="basic-button bigger">
			{#if data.currentScan}
				Continue Receipt Scan
			{:else}
				Scan Receipt
			{/if}
		</button>
	</a>
	<a class="basic-a" href="/app/items">
		<button class="basic-button bigger"> Items </button>
	</a>
	<a class="basic-a" href="/app/shopping-lists">
		<button class="basic-button bigger"> Shopping Lists </button>
	</a>
</div>

<style>
	.section {
		gap: 10px;
		align-items: center;
	}

	.bigger {
		background-color: var(--primary-color);
		color: var(--primary-contrast-color);
		font-size: 1.5em;
		padding: 10px 20px;
		display: flex;
		width: 300px;
		text-align: center;
		justify-content: center;
	}
</style>
