<script lang="ts">
	import Spinner from '$lib/toolkit/svgs/Spinner.svelte';
	import { fade, slide } from 'svelte/transition';
	import type { PageProps } from './$types';
	import ItemCard from '$lib/ItemCard.svelte';
	import type { Item } from '$lib/api/types';

	const { data }: PageProps = $props();

	let items = $derived(data.items);

	let itemForm = $state(false);
	let editItem = $state('');
	let deleteItem = $state<Item>();

	let itemTitle = $state('');
	let titleError = $state('');
	let itemWarningAmount = $state('');
	let itemQuantity = $state('');
	let quantityError = $state('');

	let generalItemError = $state('');
	let itemSaveLoading = $state(false);
	let deleteLoading = $state(false);
	let deleteError = $state<string | null>(null);

	let search = $state('');

	let searchItems = $derived.by(() => {
		if (!search) {
			return items || [];
		}
		const lowerSearch = search.toLowerCase();
		return (items || []).filter(
			(item) =>
				item.title.toLowerCase().includes(lowerSearch) ||
				item.id.toLowerCase().includes(lowerSearch)
		);
	});

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
				await data.updateItem(editItem, {
					title: itemTitle,
					warningAmount: itemWarningAmount ? parseInt(itemWarningAmount) : 0,
					quantity: parseInt(itemQuantity)
				});
			} else {
				await data.createItem({
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

<div class="section column">
	<div class="row btn-row">
		<h1>Item Management</h1>
		<button
			class="basic-button action-button"
			onclick={() => {
				itemForm = true;
				editItem = '';
			}}
		>
			New Item
		</button>
	</div>
	<p>Manage your items here. You can add, edit, and delete items from your inventory.</p>
	{#if itemForm}
		<div
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
					class="basic-button action-button"
					onclick={() => {
						itemForm = false;
						itemTitle = '';
						itemWarningAmount = '';
						itemQuantity = '';
					}}
				>
					Cancel
				</button>
				<button class="basic-button action-button" onclick={saveItem}>
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
	{/if}
	{#if items && items.length > 0}
		<p>Currently, you have {items.length} items in your inventory.</p>
		<div class="row">
			<input class="basic-field" type="text" placeholder="Search items..." bind:value={search} />
		</div>
		<div class="column item-grid">
			{#each searchItems as item (item.id)}
				<ItemCard
					deleteFunction={async () => {
						deleteItem = item;
					}}
					bind:itemForm
					bind:editItem
					bind:itemTitle
					bind:itemWarningAmount
					bind:itemQuantity
					{item}
					quantityChangeFunction={async (change: number) => {
						await data.updateItemQuantity(item.id, change);
					}}
				/>
			{/each}
		</div>
	{:else}
		<p>No items found. Start adding items to your inventory!</p>
	{/if}
</div>
{#if deleteItem}
	<div class="cover">
		<div class="popup" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
			<h2>Delete Item</h2>
			<p>Are you sure you want to delete the item "{deleteItem.title}"?</p>
			<div class="btn-row">
				<button
					class="basic-button action-button"
					onclick={() => {
						deleteItem = undefined;
					}}
				>
					Cancel
				</button>
				<button
					class="basic-button action-button"
					onclick={async () => {
						if (deleteItem) {
							deleteLoading = true;
							try {
								await data.deleteItem(deleteItem.id);
								deleteItem = undefined;
							} catch (e) {
								deleteError = e instanceof Error ? e.message : 'An unknown error occurred';
							}
						}
						deleteLoading = false;
					}}
				>
					{#if deleteLoading}
						<Spinner />
					{:else}
						Delete
					{/if}
				</button>
			</div>
			{#if deleteError}
				<small class="error-message">{deleteError}</small>
			{/if}
		</div>
	</div>
{/if}

<style>
	.section {
		gap: 20px;
		width: 100%;
	}

	.btn-row {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}

	.action-button {
		background-color: var(--primary-color);
		color: var(--primary-contrast-color);
		font-size: 1em;
		padding: 10px 20px;
		display: flex;
		width: 150px;
		text-align: center;
		justify-content: center;
	}

	.item-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
	}

	.form-row {
		display: flex;
		gap: 20px;
	}

	.popup {
		background-color: var(--background-color);
		border-radius: 10px;
		padding: 20px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		width: 400px;

		> h2 {
			color: var(--primary-color);
		}
	}
</style>
