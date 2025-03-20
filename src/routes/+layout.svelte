<script lang="ts">
	import { onMount } from 'svelte';
	import '../lib/toolkit/default-hfl.css';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import SupabaseLayout from '$lib/supabase/SupabaseLayout.svelte';
	import Footer from '$lib/Footer.svelte';

	const appName = 'HomeStock';

	let { children, data }: LayoutProps = $props();
	const { supabaseData } = $derived(data);
	const { session, supabase } = $derived(supabaseData);
	const { user } = $derived(data);

	onMount(() => {
		if (!user && page.url.pathname !== '/') {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>{appName}</title>
	<meta name="description" content={`The ${appName} Web App`} />
</svelte:head>

<SupabaseLayout {session} {supabase}>
	{@render children()}
	<Footer />
</SupabaseLayout>
