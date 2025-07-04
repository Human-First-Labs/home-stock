<script lang="ts">
	import Spinner from '$lib/toolkit/svgs/Spinner.svelte';
	import { fade } from 'svelte/transition';
	import type { ShoppingList } from '$lib/api/types';
	import type { PageProps } from './$types';
	import ShoppingListCard from '$lib/ShoppingListCard.svelte';
	import Icon from '@iconify/svelte';

	const { data }: PageProps = $props();

	let deleteShoppingList = $state<ShoppingList>();

	let generateLoading = $state(false);
	let generateError = $state<string | null>(null);
	let deleteLoading = $state(false);
	let deleteError = $state<string | null>(null);
</script>

<div class="section column">
	<div class="row btn-row">
		<div class="row">
			<a href="/app">
				<button class="hidden-button" style="color: var(--primary-color);">
					<Icon icon="material-symbols:arrow-back-rounded" font-size={32} />
				</button>
			</a>
			<h1>Shopping List Management</h1>
		</div>
		<button
			class="basic-button action-button"
			onclick={async () => {
				generateLoading = true;
				generateError = null;
				try {
					const result = await data.generateShoppingList();

					if (!result.shoppingList) {
						generateError = "No items found to generate a shopping list. You're all good!";
					}
				} catch (error) {
					generateError = error instanceof Error ? error.message : 'An unknown error occurred';
				}
				generateLoading = false;
			}}
		>
			{#if generateLoading}
				<Spinner />
			{:else}
				Generate New Shopping List
			{/if}
		</button>
		{#if generateError}
			<small class="error-message">{generateError}</small>
		{/if}
	</div>
	<p>Browse and create new Shopping Lists here.</p>
	{#if data.shoppingLists && data.shoppingLists.length > 0}
		<p>You have generated {data.shoppingLists.length} lists.</p>
		<div class="column item-grid">
			{#each data.shoppingLists as list (list.id)}
				<ShoppingListCard
					deleteFunction={async () => {
						deleteShoppingList = list;
					}}
					shoppingList={list}
				/>
			{/each}
		</div>
	{:else}
		<p>No lists found. Start generating your first!</p>
	{/if}
</div>
{#if deleteShoppingList}
	<div class="cover">
		<div class="popup" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
			<h2>Delete Item</h2>
			<p>Are you sure you want to delete a shopping list?</p>
			<div class="btn-row">
				<button
					class="basic-button action-button"
					onclick={() => {
						deleteShoppingList = undefined;
					}}
				>
					Cancel
				</button>
				<button
					class="basic-button action-button"
					onclick={async () => {
						if (deleteShoppingList) {
							try {
								deleteLoading = true;
								await data.deleteShoppingList(deleteShoppingList.id);
								deleteShoppingList = undefined;
							} catch (e) {
								deleteError = e instanceof Error ? e.message : 'An unknown error occurred';
							}
							deleteLoading = false;
						}
					}}
				>
					{#if deleteLoading}
						<Spinner />
					{:else}
						Confirm
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
		text-align: center;
		justify-content: center;
	}

	.item-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
