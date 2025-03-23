<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { invalidate } from '$app/navigation';

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

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
