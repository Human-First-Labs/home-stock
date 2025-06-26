<script lang="ts">
	import Spinner from '$lib/toolkit/svgs/Spinner.svelte';
	import { fade } from 'svelte/transition';
	import type { PageProps } from './$types';
	import ItemCard from '$lib/ItemCard.svelte';
	import type { Item } from '$lib/api/types';
	import Icon from '@iconify/svelte';
	import ItemForm from '$lib/ItemForm.svelte';

	const { data }: PageProps = $props();

	let items = $derived(data.items);

	let itemForm = $state(false);
	let editItem = $state('');
	let deleteItem = $state<Item>();

	let itemTitle = $state('');
	let itemWarningAmount = $state('');
	let itemQuantity = $state('');

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
</script>

<div class="section column">
	<div class="row btn-row">
		<div class="row">
			<a href="/app">
				<button class="hidden-button" style="color: var(--primary-color);">
					<Icon icon="material-symbols:arrow-back-rounded" font-size={32} />
				</button>
			</a>
			<h1>Items</h1>
		</div>
		<button
			class="basic-button"
			onclick={() => {
				itemForm = true;
				editItem = '';
			}}
		>
			New Item
		</button>
	</div>
	<p id="item-form">
		Manage your items here. You can add, edit, and delete items from your inventory.
	</p>
	{#if itemForm}
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
		<ItemForm
			bind:itemForm
			bind:editItem
			bind:itemTitle
			bind:itemWarningAmount
			bind:itemQuantity
			createItem={data.createItem}
			updateItem={data.updateItem}
		/>
		<hr class="basic-hr" />
	{/if}
	{#if items && items.length > 0}
		<p>Currently, you have {items.length} items in your inventory.</p>
		<div class="row">
			<input class="basic-input" type="text" placeholder="Search items..." bind:value={search} />
		</div>
		<div class="column item-grid">
			{#each searchItems as item (item.id)}
				<ItemCard
					deleteFunction={async () => {
						deleteItem = item;
					}}
					onEditClick={() => {
						itemForm = true;
						editItem = item.id;
						itemTitle = item.title;
						itemWarningAmount = item.warningAmount.toString();
						itemQuantity = item.quantity.toString();
						window.location.href = '#item-form';
					}}
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
					class="basic-button"
					onclick={() => {
						deleteItem = undefined;
					}}
				>
					Cancel
				</button>
				<button
					class="basic-button"
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

	.item-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
	}
</style>
