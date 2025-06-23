<script lang="ts">
	import { goto } from '$app/navigation';
	import SupabaseLogin from '$lib/supabase/SupabaseLogin.svelte';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import SupabaseLayout from '$lib/supabase/SupabaseLayout.svelte';

	const { children, data }: LayoutProps = $props();

	const { user, supabaseData } = $derived(data);
	const { supabase, session } = $derived(supabaseData);

	const logout = async () => {
		goto('/');
		const { error } = await supabaseData.supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error.message);
		}
	};

	//TODO here would be the offline check once it is implemented
</script>

<SupabaseLayout {session} {supabase}>
	<div class="column content" style="gap: 20px">
		{#if !user}
			<SupabaseLogin {supabase} code={page.url.searchParams.get('code') || undefined} />
		{:else}
			<div class="section column">
				<div class="section-content">
					{@render children()}
					<hr class="basic-hr" />
					<button class="basic-button bigger" onclick={logout}> Logout </button>
					<p>Logged In with {data.supabaseData.user?.email}</p>
				</div>
			</div>
		{/if}
	</div>
</SupabaseLayout>

<style>
	.content {
		padding-top: 20px;
		padding-bottom: 40px;
		max-width: var(--max-site-width);
		height: 100%;
		width: 100%;
		align-self: center;
	}

	.section {
		justify-content: center;
		align-items: center;
		width: 100%;
		display: flex;
		padding: 50px 0;
		gap: 20px;
	}
	.section-content {
		display: flex;
		flex-direction: column;
		width: 80%;
		gap: 20px;
		justify-content: center;
		align-items: center;
	}

	.bigger {
		background-color: var(--primary-color);
		color: var(--primary-contrast-color);
		font-size: 1.5em;
		padding: 10px 20px;
		display: flex;
		width: 300px;
		text-align: center;
		justify-content: center;
	}
</style>
