<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const disabled = $derived.by(() => {
		if (!data.currentScan?.lines.length && (data.scanNumbers?.number || 0) >= 10) {
			return true;
		} else {
			return false;
		}
	});
</script>

<div class="section column">
	<h1>Welcome to HomeStock</h1>
	<div class="column">
		{#if data.currentScan}
			<small>Current Scan: {data.currentScan.lines.length} items</small>
		{/if}
		<a class="basic-a" href="/app/scan">
			<button class="basic-button bigger" {disabled}>
				{#if data.currentScan}
					Continue Receipt Scan
				{:else}
					Scan Receipt
				{/if}
			</button>
		</a>
		<small style="text-align: center; color: var(--text-color); width: 100%"
			>({data.scanNumbers?.number || 0}/10 monthly scans)</small
		>
	</div>
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
