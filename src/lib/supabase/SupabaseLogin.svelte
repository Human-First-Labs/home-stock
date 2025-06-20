<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Turnstile } from 'svelte-turnstile';
	import { page } from '$app/state';
	import { goto, invalidateAll } from '$app/navigation';
	import Spinner from '$lib/toolkit/svgs/Spinner.svelte';

	let {
		supabase
	}: {
		supabase: SupabaseClient<any, 'public', any>;
	} = $props();

	let token = $state<string | null>(null);
	let tokenError = $state('');
	let email = $state('');
	let emailError = $state('');

	let loginLoading = $state(false);

	let status = $state<'logging' | 'email-sent'>('logging');

	const VITE_TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

	const login = async (token: string) => {
		let stop = false;

		if (!email) {
			emailError = 'Please enter your email address';
			stop = true;
		} else {
			emailError = '';
		}

		if (!token) {
			tokenError = 'Please complete the captcha';
			stop = true;
		} else {
			tokenError = '';
		}

		if (!stop) {
			loginLoading = true;
			console.log('test', page.url.origin + '/app');
			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					captchaToken: token,
					emailRedirectTo: page.url.origin + '/app'
				}
			});
			if (error) {
				console.error(error);
			}
			status = 'email-sent';
			loginLoading = false;
		}
	};

	const tokenGetter = (e: CustomEvent<{ token: string; preClearanceObtained: boolean }>) => {
		token = e.detail.token;
	};
</script>

<div class="column main">
	<div class="column form">
		<h2>Login to HomeStock</h2>
		{#if status === 'email-sent'}
			<h4>An email has been sent to you with a link to login.</h4>
		{:else}
			<h4>Login with your email below, to start wasting less, and having more!</h4>
			<div class="column">
				<input
					class="basic-field"
					type="email"
					placeholder="Email Address"
					name="emailAddress"
					bind:value={email}
				/>
				{#if emailError}
					<small class="error-message">{emailError}</small>
				{/if}
			</div>
			<div class="container">
				<Turnstile siteKey={VITE_TURNSTILE_SITE_KEY} on:callback={tokenGetter} />
				{#if tokenError}
					<small class="error-message">{tokenError}</small>
				{/if}
			</div>
			<div class="row action-rows">
				<button
					class="primary-button bigger"
					onclick={() => {
						goto('/');
					}}>Cancel</button
				>
				<button
					class="primary-button bigger"
					onclick={() => {
						login(token!);
					}}
				>
					{#if loginLoading}
						<Spinner />
					{:else}
						Login
					{/if}
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	h4 {
		margin: 0;
		text-align: center;
	}

	.form {
		min-width: 340px;
		gap: 20px;
		padding: 20px;
		align-items: center;
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

	.main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>
