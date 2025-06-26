<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import { clickOutside } from './actions';

	export interface DrawerProps {
		/** The content of the drawer */
		children: Snippet;
		/** Whether the drawer is open or not */
		open: boolean;
		/** Function to call when the drawer is dismissed */
		onDismiss: () => void;
		/** Hide on computer */
		hideOnComputer?: boolean;
	}

	const { children, open, onDismiss, hideOnComputer }: DrawerProps = $props();
</script>

{#if open}
	<div class={['cover', hideOnComputer ? 'hidden-on-computer' : '']}>
		<div
			use:clickOutside={{
				callbackFunction: onDismiss
			}}
			class="drawer"
			in:slide={{ duration: 200, axis: 'x' }}
			out:slide={{ duration: 200, axis: 'x' }}
		>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.drawer {
		height: 100vh;
		width: 70%;
		position: fixed;
		/* top: 0; */
		left: 0;
		z-index: 10;
	}
</style>
