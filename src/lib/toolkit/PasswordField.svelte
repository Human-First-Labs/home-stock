<script lang="ts">
	import Icon from '@iconify/svelte';

	export interface PasswordFieldProps {
		name?: string;
		placeholder?: string;
		value?: string;
	}

	let { name, value = $bindable(), placeholder }: PasswordFieldProps = $props();

	let hidden = $state(true);
</script>

<div class="row basic-input">
	<input
		bind:value
		{name}
		class="hidden-input"
		type={hidden ? 'password' : 'text'}
		placeholder={placeholder || 'Password'}
	/>
	<div class="column">
		<button
			class="hidden-button"
			onclick={() => {
				hidden = !hidden;
			}}
			style="flex: 1"
		>
			{#if hidden}
				<Icon icon="material-symbols:visibility-off" font-size={18} />
			{:else}
				<Icon icon="material-symbols:visibility" font-size={18} />
			{/if}
		</button>
	</div>
</div>

<style>
	input {
		flex: 1;
	}
</style>
