<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import type { ShoppingList } from './api/types';
	import { DateTime } from 'luxon';

	export interface ShoppingListCardProps {
		shoppingList: ShoppingList;
		deleteFunction: () => void;
	}

	let { shoppingList, deleteFunction }: ShoppingListCardProps = $props();
</script>

<div class="list-card" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
	<div class="row btn-row">
		<h2>{DateTime.fromISO(shoppingList.createdAt).toFormat('dd/mm/yyyy')}</h2>
		<a href="/app/shopping-lists/{shoppingList.id}">
			<button class="hidden-button icon-button" type="button">
				<Icon icon="material-symbols:checklist-rounded" font-size={20} />
			</button>
		</a>
	</div>
	<p>Items in list: {shoppingList.items.length}</p>

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

	.list-card {
		border: 1px solid var(--primary-color);
		padding: 20px;
		border-radius: 8px;
		width: 200px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.list-card h2 {
		margin: 0;
		font-size: 1.2em;
	}

	.list-card p {
		margin: 5px 0;
	}

	.btn-row {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}
</style>
