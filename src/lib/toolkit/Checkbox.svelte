<script lang="ts">
	import Icon from '@iconify/svelte';

	export type CheckboxState = 'yes' | 'indeterminate' | 'no';

	export interface CheckboxProps {
		/** The name of the checkbox */
		name?: string;
		/** The state of the checkbox */
		checked?: CheckboxState;
		/** The function to call when the checkbox is clicked */
		onClick?: (state: CheckboxState) => void;
		/** The label of the checkbox */
		label: string;
		/** Disabled */
		disabled?: boolean;
	}

	let { name, checked = $bindable(), onClick, label, disabled }: CheckboxProps = $props();

	let localState = $state(false);

	let actualState: CheckboxState = $derived.by(() => {
		if (checked === undefined) {
			return localState ? 'yes' : 'no';
		} else {
			return checked;
		}
	});
</script>

<input type="checkbox" {name} {disabled} style="display: none;" checked={localState} />
<button
	type="button"
	class={['checkbox', 'hidden-button', disabled ? 'disabled' : '']}
	onclick={() => {
		if (checked === undefined) {
			localState = !localState;
		} else {
			checked = actualState === 'yes' ? 'no' : 'yes';
		}

		onClick && onClick(actualState);
	}}
	{disabled}
>
	<div class="row" style="gap: 5px; flex-wrap: nowrap;">
		{#if actualState === 'yes'}
			<Icon
				icon="material-symbols:priority-outline"
				font-size={24}
				style="color: var(--primary-color)"
			/>
		{:else if actualState === 'indeterminate'}
			<div class="indeterminate">
				<hr />
			</div>
		{:else}
			<div class="unselected"></div>
		{/if}
		<p>{label}</p>
	</div>
</button>

<style>
	.checkbox {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.unselected {
		border: 2px solid black;
		border-radius: 6px;
		width: 18px;
		height: 18px;
		margin: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.indeterminate {
		border: 2px solid var(--primary-color);
		border-radius: 6px;
		width: 18px;
		height: 18px;
		margin: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	hr {
		width: 50%;
		border: 1px solid var(--primary-color);
		margin: 0;
		display: flex;
	}

	.disabled {
		opacity: 0.5;
	}

	p {
		text-align: start;
		flex: 1;
	}
</style>
