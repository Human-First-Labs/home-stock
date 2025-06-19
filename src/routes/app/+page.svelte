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

<div class="section">
	<div class="section-content">
		<button class="basic-button bigger"> Scan a Receipt </button>
		<button class="basic-button bigger"> Items </button>
		<button class="basic-button bigger"> Shopping Lists </button>
		<hr class="basic-hr" />
		<button class="basic-button bigger" onclick={logout}> Logout </button>
	</div>
</div>

<style>
	.section {
		justify-content: center;
		width: 100%;
		display: flex;
		padding: 50px 0;
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
