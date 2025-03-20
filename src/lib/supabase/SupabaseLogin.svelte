<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import Cover from '../toolkit/Cover.svelte';
	import { Turnstile } from 'svelte-turnstile';
	import { page } from '$app/state';

	let {
		supabase
	}: {
		supabase: SupabaseClient<any, 'public', any>;
	} = $props();

	let token = $state<string | null>(null);

	let status = $state<'logging' | 'email-sent'>('logging');

	const VITE_TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

	const login = async (token: string) => {
		const email = document.querySelector('.hfl-field') as HTMLInputElement;
		if (!email) return;

		const { error } = await supabase.auth.signInWithOtp({
			email: email.value,
			options: {
				captchaToken: token,
				emailRedirectTo: page.url.href
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

<Cover>
	<div class="popup">
		<h2>Login to HomeStock</h2>
		{#if status === 'email-sent'}
			<h4>An email has been sent to you with a link to login</h4>
		{:else}
			<h4>Login with your email below, so we know what is yours and what isn't!</h4>
			<input
				class="hfl-field"
				type="email"
				placeholder="Email Address"
				name="emailAddress"
				required
			/>
			<Turnstile siteKey={VITE_TURNSTILE_SITE_KEY} on:callback={tokenGetter} />
			{#if token !== null}
				<button
					class="hfl-button bigger"
					onclick={() => {
						login(token!);
					}}>Login</button
				>
			{/if}
		{/if}
	</div>
</Cover>

<style>
	.bigger {
		font-size: 1.5rem;
		padding: 10px 20px;
	}
</style>
