<script lang="ts">
	import type { LayoutProps } from '../$types';
	import SupabaseAnonLogin from '$lib/supabase/SupabaseAnonLogin.svelte';

	let { children, data }: LayoutProps = $props();
	const { supabaseData } = $derived(data);
	const { session, supabase } = $derived(supabaseData);
</script>

{#if !session}
	<SupabaseAnonLogin {supabase} />
{:else}
	{@render children()}
{/if}
