<script lang="ts">
	import { slide } from 'svelte/transition';
	import Spinner from './toolkit/svgs/Spinner.svelte';

	export interface ItemFormProps {
		itemForm: boolean;
		editItem?: string;
		itemTitle: string;
		itemWarningAmount: string;
		itemQuantity: string;
		updateItem?: (
			item: string,
			data: { title: string; warningAmount: number; quantity: number }
		) => Promise<void>;
		createItem: (data: { title: string; warningAmount: number; quantity: number }) => Promise<void>;
	}

	let {
		itemForm = $bindable(),
		editItem = $bindable(),
		itemTitle = $bindable(),
		itemWarningAmount = $bindable(),
		itemQuantity = $bindable(),
		createItem,
		updateItem
	}: ItemFormProps = $props();

	let itemSaveLoading = $state(false);
	let generalItemError = $state('');
	let titleError = $state('');
	let quantityError = $state('');

	const saveItem = async () => {
		let stop = false;
		if (!itemTitle) {
			titleError = 'Please enter a title for the item';
			stop = true;
		} else {
			titleError = '';
		}
		if (!itemQuantity || parseInt(itemQuantity) < 0) {
			quantityError = 'Please enter a valid quantity';
			stop = true;
		} else {
			quantityError = '';
		}

		if (stop) {
			return;
		}

		itemSaveLoading = true;
		try {
			if (editItem) {
				if (updateItem) {
					await updateItem(editItem, {
						title: itemTitle,
						warningAmount: itemWarningAmount ? parseInt(itemWarningAmount) : 0,
						quantity: parseInt(itemQuantity)
					});
				} else {
					throw new Error('Update function is not provided');
				}
			} else {
				await createItem({
					title: itemTitle,
					warningAmount: itemWarningAmount ? parseInt(itemWarningAmount) : 0,
					quantity: parseInt(itemQuantity)
				});
			}
		} catch (e) {
			console.error('Error saving item:', e);
			generalItemError = 'An error occurred while saving the item. Please try again.';
		}
		itemSaveLoading = false;
		itemForm = false;
		itemTitle = '';
		itemWarningAmount = '';
		itemQuantity = '';
	};
</script>

<div
	id="item-form"
	class="column"
	style="gap: 20px"
	in:slide={{ duration: 500 }}
	out:slide={{ duration: 500 }}
>
	<hr class="basic-hr" />
	<div class="row btn-row">
		<h2>
			{#if editItem}
				Edit Item
			{:else}
				Add New Item
			{/if}
		</h2>
	</div>
	<div class="row form-row">
		<div class="column">
			<input class="basic-field" type="text" placeholder="Title" bind:value={itemTitle} />
			{#if titleError}
				<small class="error-message">{titleError}</small>
			{/if}
		</div>
		<div class="column">
			<input
				class="basic-field"
				type="number"
				placeholder="Warning Quantity"
				bind:value={itemWarningAmount}
			/>
		</div>
		<div class="column">
			<input
				class="basic-field"
				type="number"
				placeholder="Current Quantity"
				bind:value={itemQuantity}
			/>
			{#if quantityError}
				<small class="error-message">{quantityError}</small>
			{/if}
		</div>
	</div>
	<div class="row btn-row">
		<button
			class="basic-button"
			onclick={() => {
				itemForm = false;
				itemTitle = '';
				itemWarningAmount = '';
				itemQuantity = '';
			}}
		>
			Cancel
		</button>
		<button class="basic-button" onclick={saveItem}>
			{#if itemSaveLoading}
				<Spinner />
			{:else}
				Save
			{/if}
		</button>
	</div>
	{#if generalItemError}
		<small class="error-message">{generalItemError}</small>
	{/if}
	<hr class="basic-hr" />
</div>

<style>
	.form-row {
		display: flex;
		gap: 20px;
	}

	.btn-row {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}
</style>
