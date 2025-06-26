<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Turnstile } from 'svelte-turnstile';
	import { page } from '$app/state';
	import { goto, invalidateAll } from '$app/navigation';
	import Spinner from '$lib/toolkit/svgs/Spinner.svelte';

	let {
		supabase,
		code
	}: {
		supabase: SupabaseClient<any, 'public', any>;
		code: string | undefined;
	} = $props();

	let token = $state<string | null>(null);
	let tokenError = $state('');
	let email = $state('');
	let emailError = $state('');
	let emailCode = $state<string | null>(code || '');
	let emailCodeError = $state('');

	let loginLoading = $state(false);
	let loginError = $state<string | null>(null);
	let verifyLoading = $state(false);
	let verifyError = $state<string | null>(null);

	let status = $state<'logging' | 'email-sent'>(code ? 'email-sent' : 'logging');

	const VITE_TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

	const login = async () => {
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
			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					captchaToken: token!,
					emailRedirectTo: page.url.origin + '/app'
				}
			});
			if (error) {
				console.error(error);
				loginError = error.message;
			} else {
				localStorage.setItem('temp-login-email', email);
				status = 'email-sent';
			}
			loginLoading = false;
		}
	};

	const verifyLogin = async () => {
		if (!emailCode) {
			emailCodeError = 'Please enter the code from your email';
		} else {
			emailCodeError = '';
			verifyLoading = true;
			const actualEmail = email || localStorage.getItem('temp-login-email') || '';
			const { error } = await supabase.auth.verifyOtp({
				email: actualEmail,
				token: emailCode,
				type: 'email'
			});
			if (error) {
				console.error(error);
				verifyError = error.message;
			} else {
				localStorage.removeItem('temp-login-email');
				emailCode = '';
				email = '';
				await invalidateAll();
				goto('/app', {
					replaceState: true
				});
				status = 'logging';
			}
			verifyLoading = false;
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
			<h4>An email has been sent to you with your one time login code.</h4>
			<h4>Please check your inbox and enter the code below.</h4>
			<div class="column">
				<input
					class="basic-input"
					type="text"
					placeholder="One Time Login Code"
					name="emailCode"
					bind:value={emailCode}
				/>
				{#if emailCodeError}
					<small class="error-message">{emailCodeError}</small>
				{/if}
			</div>
			<div class="row action-rows">
				<button
					class="primary-button bigger"
					onclick={() => {
						goto('/');
					}}>Cancel</button
				>
				<button class="primary-button bigger" onclick={verifyLogin}>
					{#if verifyLoading}
						<Spinner />
					{:else}
						Verify Code
					{/if}
				</button>
			</div>
			{#if verifyError}
				<small class="error-message">{verifyError}</small>
			{/if}
		{:else}
			<h4>Login with your email below, to start wasting less, and having more!</h4>
			<div class="column">
				<input
					class="basic-input"
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
				<button class="primary-button bigger" onclick={login}>
					{#if loginLoading}
						<Spinner />
					{:else}
						Login
					{/if}
				</button>
			</div>
			{#if loginError}
				<small class="error-message">{loginError}</small>
			{/if}
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
