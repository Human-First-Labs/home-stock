<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Turnstile } from 'svelte-turnstile';
	import { page } from '$app/state';
	import { goto, invalidateAll } from '$app/navigation';

	let {
		supabase
	}: {
		supabase: SupabaseClient<any, 'public', any>;
	} = $props();

	let token = $state<string | null>(null);

	let status = $state<'logging' | 'email-sent'>('logging');

	const VITE_TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

	const login = async (token: string) => {
		const email = document.querySelector('.basic-field') as HTMLInputElement;
		if (!email) return;

		const { error } = await supabase.auth.signInWithOtp({
			email: email.value,
			options: {
				captchaToken: token,
				emailRedirectTo: page.url.origin + '/app'
			}
		});
		if (error) {
			console.error(error);
		}
		status = 'email-sent';
	};

	const tokenGetter = (e: CustomEvent<{ token: string; preClearanceObtained: boolean }>) => {
		token = e.detail.token;
	};
</script>

<div class="cover">
	<div class="popup">
		<h2>Login to HomeStock</h2>
		{#if status === 'email-sent'}
			<h4>An email has been sent to you with a link to login</h4>
			<button
				class="basic-button bigger"
				onclick={() => {
					invalidateAll();
				}}>Continue</button
			>
		{:else}
			<h4>Login with your email below, so we know what is yours and what isn't!</h4>
			<input
				class="basic-field"
				type="email"
				placeholder="Email Address"
				name="emailAddress"
				required
			/>
			<div class="container">
				<Turnstile siteKey={VITE_TURNSTILE_SITE_KEY} on:callback={tokenGetter} />
			</div>
			<div class="row action-rows">
				<button
					class="basic-button bigger"
					onclick={() => {
						goto('/');
					}}>Cancel</button
				>
				<button
					class="basic-button bigger"
					onclick={() => {
						login(token!);
					}}>Login</button
				>
			</div>
		{/if}
	</div>
</div>

<style>
	h4 {
		margin: 0;
	}

	.popup {
		min-width: 340px;
		gap: 20px;
	}

	.bigger {
		font-size: 1.5rem;
		padding: 10px 20px;
	}

	.action-rows {
		gap: 10px;
		display: flex;
		justify-content: space-around;
		width: 100%;
	}
</style>
