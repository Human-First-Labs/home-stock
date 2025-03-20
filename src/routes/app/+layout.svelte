<script lang="ts">
	import type { LayoutProps } from './$types';

	const { children, data }: LayoutProps = $props();

	//TODO here would be the offline check once it is implemented
</script>

{@render children()}
