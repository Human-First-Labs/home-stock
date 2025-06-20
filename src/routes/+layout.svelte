<script lang="ts">
	import '../lib/toolkit/default-hfl.css';
	import '../general.css';
	import type { LayoutProps } from './$types';
	import SupabaseLayout from '$lib/supabase/SupabaseLayout.svelte';
	import Footer from '$lib/Footer.svelte';
	import { page } from '$app/state';

	const appName = 'HomeStock';

	let { children, data }: LayoutProps = $props();
	const { supabaseData } = $derived(data);
	const { session, supabase } = $derived(supabaseData);
</script>

<svelte:head>
	<title>{appName}</title>
	<meta name="description" content={`The ${appName} Web App`} />
</svelte:head>

<SupabaseLayout {session} {supabase} token={page.url.searchParams.get('token_hash') || undefined}>
	{@render children()}
	<Footer />
</SupabaseLayout>
