<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { invalidate } from '$app/navigation';

	import type { EmailOtpType, Session, SupabaseClient } from '@supabase/supabase-js';
	import { page } from '$app/state';

	let {
		session,
		supabase,
		children
	}: {
		session: Session | null;
		supabase: SupabaseClient<any, 'public', any>;
		children: Snippet;
	} = $props();

	// let checkedVerify = $state(false);

	const checkForOTPVerification = async () => {
		if (page.url.searchParams.has('token_hash') && page.url.searchParams.has('type')) {
			await supabase.auth.verifyOtp({
				token_hash: page.url.searchParams.get('token_hash')!,
				type: page.url.searchParams.get('type')! as EmailOtpType
			});
		}
		// checkedVerify = true;
	};

	onMount(() => {
		checkForOTPVerification();

		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
