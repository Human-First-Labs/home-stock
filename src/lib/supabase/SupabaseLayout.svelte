<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { invalidate } from '$app/navigation';

	import type { Session, SupabaseClient } from '@supabase/supabase-js';

	export interface SupabaseLayoutProps {
		session: Session | null;
		supabase: SupabaseClient<any, 'public', any>;
		token: string | undefined;
		children: Snippet;
	}

	let { session, supabase, token, children }: SupabaseLayoutProps = $props();

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		if (token) {
			supabase.auth.verifyOtp({
				token_hash: token,
				type: 'email'
			});
		}

		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
