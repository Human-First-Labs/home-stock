<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutProps } from '../$types';

	let { children }: LayoutProps = $props();

	let ready = $state(false);
	onMount(() => (ready = true));
</script>

{#if ready}
	<div class="content">
		{@render children()}
	</div>
{/if}

<style>
	.content {
		display: flex;
	}
</style>
