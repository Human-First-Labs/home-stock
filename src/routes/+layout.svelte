<script lang="ts">
	// import SupabaseLayout from "$lib/supabase/SupabaseLayout.svelte";
	import type { LayoutProps } from "./$types";
	import '../app.css';

	const appName = "Shareiety";

    let { children, 
	// ...restOfProps 
	}: LayoutProps = $props()
</script>

<svelte:head>
	<title>{appName}</title>
	<meta name="description" content="The Shareiety Web App" />
</svelte:head>

<!-- <SupabaseLayout {...restOfProps}> -->
	{@render children()}
<!-- </SupabaseLayout> -->