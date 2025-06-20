<script lang="ts">
	import SupabaseLogin from '$lib/supabase/SupabaseLogin.svelte';
	import type { LayoutProps } from './$types';

	const { children, data }: LayoutProps = $props();

	const { user, supabaseData } = $derived(data);
	const { supabase } = $derived(supabaseData);

	//TODO here would be the offline check once it is implemented
</script>

<div class="column content" style="gap: 20px">
	{#if !user}
		<SupabaseLogin {supabase} />
	{:else}
		{@render children()}
	{/if}
</div>

<style>
	.content {
		padding-top: 20px;
		padding-bottom: 40px;
		max-width: var(--max-site-width);
		height: 100%;
		width: 100%;
		align-self: center;
	}
</style>
