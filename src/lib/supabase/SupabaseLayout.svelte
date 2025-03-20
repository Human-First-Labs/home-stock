<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Turnstile } from 'svelte-turnstile';

	import Cover from '$lib/toolkit/Cover.svelte';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';

	let {
		session,
		supabase,
		children
	}: {
		session: Session | null;
		supabase: SupabaseClient<any, 'public', any>;
		children: Snippet;
	} = $props();

	const VITE_TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

	const getCurrentSession = (captchaToken: string | undefined, controller?: AbortController) => {
		if (controller?.signal.aborted) {
			return Promise.reject(new DOMException('Aborted', 'AbortError'));
		}

		return new Promise((resolve, reject) => {
			const abortHandler = () => {
				reject(new DOMException('Aborted', 'AbortError'));
			};

			supabase.auth
				.getSession()
				.then(async (response) => {
					if (!captchaToken) {
						return reject(new Error('captcha token is missing'));
					}
					const result = await supabase.auth.signInAnonymously({
						options: {
							captchaToken
						}
					});
					controller?.signal.removeEventListener('abort', abortHandler);
					if (result.error) {
						console.error(result.data);
						reject(result.error);
					} else {
						resolve(response.data);
					}
				})
				.catch((error) => {
					controller?.signal.removeEventListener('abort', abortHandler);
					reject(error);
				});
			controller?.signal.addEventListener('abort', abortHandler);
		});
	};

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	const tokenGetter = (e: CustomEvent<{ token: string; preClearanceObtained: boolean }>) => {
		getCurrentSession(e.detail.token);
	};
</script>

{#if !session}
	<Cover>
		<div class="popup">
			<h2>Sorry about this!</h2>
			<h4>Just making sure you're not a bot</h4>
			<small>You know how it is these days :(</small>
			<Turnstile siteKey={VITE_TURNSTILE_SITE_KEY} on:callback={tokenGetter} />
		</div>
	</Cover>
{/if}
{@render children()}

<style>
	.popup {
		display: flex;
		background-color: var(--primary-color);
		align-items: center;
		flex-direction: column;
		border-radius: 16px;
		max-width: 60%;
		padding: 20px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		text-align: center;
		gap: 20px;
	}

	h2,
	h4,
	small {
		margin: 0;
	}
</style>
