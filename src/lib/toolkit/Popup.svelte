<script lang="ts">
	import { fade } from 'svelte/transition';
	import { clickOutside } from './actions';
	import type { Snippet } from 'svelte';

	export interface PopupProps {
		/** The content of the popup */
		children: Snippet;
		/** Whether the popup is open or not */
		open: boolean;
		/** Function to call when the popup is dismissed */
		onDismiss?: () => void;
	}

	const { children, open, onDismiss }: PopupProps = $props();
</script>

{#snippet cardAndChildren()}
	<div class="card">
		{@render children()}
	</div>
{/snippet}

{#if open}
	<div class="cover">
		{#if onDismiss}
			<div
				use:clickOutside={{
					callbackFunction: onDismiss
				}}
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 200 }}
			>
				{@render cardAndChildren()}
			</div>
		{:else}
			<div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
				{@render cardAndChildren()}
			</div>
		{/if}
	</div>
{/if}
