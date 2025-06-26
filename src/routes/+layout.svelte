<script lang="ts">
	import '../lib/toolkit/default-hfl.css';
	import '../general.css';
	import type { LayoutProps } from './$types';
	import Footer from '$lib/Footer.svelte';

	const appName = 'HomeStock';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>{appName}</title>
	<meta name="description" content={`The ${appName} Web App`} />
</svelte:head>

{@render children()}
<Footer />
