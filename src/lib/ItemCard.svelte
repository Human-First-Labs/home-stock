<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import Spinner from './toolkit/svgs/Spinner.svelte';

	export interface ItemCardProps {
		item: {
			id: string;
			title: string;
			warningAmount: number;
			quantity: number;
		};
		itemForm: boolean;
		editItem: string | undefined;
		itemTitle: string;
		itemWarningAmount: string;
		itemQuantity: string;
		deleteFunction: () => void;
		quantityChangeFunction: (change: number) => Promise<void>;
	}

	let {
		item,
		itemForm = $bindable(),
		editItem = $bindable(),
		itemTitle = $bindable(),
		itemWarningAmount = $bindable(),
		itemQuantity = $bindable(),
		deleteFunction,
		quantityChangeFunction
	}: ItemCardProps = $props();

	let quantityLoading = $state(false);
</script>

<div class="item-card" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
	<div class="row btn-row">
		<h2>{item.title}</h2>
		<button
			class="hidden-button icon-button"
			type="button"
			onclick={() => {
				itemForm = true;
				editItem = item.id;
				itemTitle = item.title;
				itemWarningAmount = item.warningAmount.toString();
				itemQuantity = item.quantity.toString();
			}}
		>
			<Icon icon="material-symbols:edit-outline-rounded" font-size={20} />
		</button>
	</div>
	<p>Warning Quantity: {item.warningAmount}</p>
	<p>Current Quantity: {item.quantity}</p>
	<div class="row btn-row">
		<button
			class="basic-button quantity-button"
			disabled={item.quantity <= 0}
			onclick={async () => {
				quantityLoading = true;
				try {
					await quantityChangeFunction(-1);
				} catch (e) {
					console.error('Error changing quantity:', e);
				}
				quantityLoading = false;
			}}
		>
			{#if quantityLoading}
				<Spinner />
			{:else}
				-
			{/if}
		</button>
		<button
			class="basic-button quantity-button"
			onclick={async () => {
				quantityLoading = true;
				try {
					await quantityChangeFunction(1);
				} catch (e) {
					console.error('Error changing quantity:', e);
				}
				quantityLoading = false;
			}}
		>
			{#if quantityLoading}
				<Spinner />
			{:else}
				+
			{/if}
		</button>
	</div>

	<hr class="basic-hr" />
	<button class="hidden-button icon-button" type="button" onclick={deleteFunction}>
		<Icon icon="material-symbols:delete-forever-outline-rounded" font-size={20} />
	</button>
</div>

<style>
	.icon-button {
		display: flex;
		background-color: transparent;
		width: fit-content;
		height: fit-content;
		color: var(--primary-color);
		margin: 0;
		padding: 0;
	}

	.item-card {
		border: 1px solid var(--primary-color);
		padding: 20px;
		border-radius: 8px;
		width: 200px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.item-card h2 {
		margin: 0;
		font-size: 1.2em;
	}

	.item-card p {
		margin: 5px 0;
	}

	.quantity-button {
		background-color: var(--primary-color);
		color: var(--primary-contrast-color);
		font-size: 1em;
		padding: 10px 20px;
		display: flex;
		flex: 1;
		text-align: center;
		justify-content: center;
	}

	.quantity-button:disabled {
		background-color: var(--text-color);
		color: var(--primary-contrast-color);
		cursor: not-allowed;
	}

	.btn-row {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}
</style>
