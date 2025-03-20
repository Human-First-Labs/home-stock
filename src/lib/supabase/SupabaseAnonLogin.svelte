<script lang="ts">
	import { Turnstile } from 'svelte-turnstile';

	import Cover from '$lib/toolkit/Cover.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';

	let {
		supabase
	}: {
		supabase: SupabaseClient<any, 'public', any>;
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

	const tokenGetter = (e: CustomEvent<{ token: string; preClearanceObtained: boolean }>) => {
		getCurrentSession(e.detail.token);
	};
</script>

<Cover>
	<div class="popup">
		<h2>Sorry about this!</h2>
		<h4>Just making sure you're not a bot</h4>
		<small>You know how it is these days :(</small>
		<Turnstile siteKey={VITE_TURNSTILE_SITE_KEY} on:callback={tokenGetter} />
	</div>
</Cover>

<style>
	h2,
	h4,
	small {
		margin: 0;
	}
</style>
