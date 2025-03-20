<script lang="ts">
	import SupabaseLogin from '$lib/supabase/SupabaseLogin.svelte';
	import type { LayoutProps } from './$types';

	const { children, data }: LayoutProps = $props();

	const { user, supabaseData } = $derived(data);
	const { supabase } = $derived(supabaseData);

	//TODO here would be the offline check once it is implemented
</script>

{#if !user}
	<SupabaseLogin {supabase} />
{:else}
	{@render children()}
{/if}
