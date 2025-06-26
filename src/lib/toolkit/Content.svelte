<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	export interface ContentProps {
		/** This is just the text */
		children: Snippet;
	}

	const { children }: ContentProps = $props();

	let ready = $state(false);
	onMount(() => (ready = true));
</script>

{#if ready}
	<section
		in:fade={{
			delay: 0,
			duration: 500
		}}
	>
		{@render children()}
	</section>
{/if}

<style>
	section {
		display: flex;
		width: 100%;
		flex-direction: column;
		flex: 1;
		box-sizing: border-box;
		padding: 0 20px;
		position: relative;
	}
</style>
