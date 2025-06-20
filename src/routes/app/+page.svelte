<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const { supabaseData } = $derived(data);

	const logout = async () => {
		goto('/');
		const { error } = await supabaseData.supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error.message);
		}
	};
</script>

<div class="section column">
	<h1>Welcome to HomeStock</h1>
	<div class="section-content">
		{#if !data.currentScan.status}
			<p>Current Scan: {data.currentScan.lines.length} items</p>
		{/if}
		<button class="basic-button bigger"> Scan a Receipt </button>
		<button class="basic-button bigger"> Items </button>
		<button class="basic-button bigger"> Shopping Lists </button>
		<hr class="basic-hr" />
		<p>Logged In with {data.supabaseData.user?.email}</p>
		<button class="basic-button bigger" onclick={logout}> Logout </button>
	</div>
</div>

<style>
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
