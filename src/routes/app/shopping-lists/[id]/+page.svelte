<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageProps } from './$types';
	import { DateTime } from 'luxon';

	interface ItemState {
		id: string;
		title: string;
		currentQuantity: number;
		warningAmount: number;
		state: 'done' | 'pending';
	}

	const { data }: PageProps = $props();

	let items: ItemState[] = $derived.by(() =>
		(
			data.shoppingList?.items.sort((item) =>
				item.title.toLowerCase().localeCompare(item.title.toLowerCase())
			) || []
		).map((item) => ({
			...item,
			state: 'pending'
		}))
	);
</script>

<div class="section column">
	<div class="row">
		<a href="/app">
			<button class="hidden-button" style="color: var(--primary-color);">
				<Icon icon="material-symbols:arrow-back-rounded" font-size={32} />
			</button>
		</a>
		<h1>
			Shopping list - {data.shoppingList
				? DateTime.fromISO(data.shoppingList?.createdAt).toFormat('dd/mm/yyyy')
				: ''}
		</h1>
	</div>
	<p>
		Marked as done: {items.filter((item) => item.state === 'done').length}/{data.shoppingList?.items
			.length}
	</p>
	<hr class="basic-hr" />
	<div class="column" style="gap: 20px;">
		{#each items as item (item.id)}
			<div
				class="row"
				style="width: 100%; align-items: center; justify-content: space-between; position: relative;"
			>
				<div class="column">
					<h3>{item.title}</h3>
				</div>
				<p>Current: {item.currentQuantity}</p>
				<p>Warning: {item.warningAmount}</p>
				<div class="column">
					{#if item.state === 'done'}
						<button
							class="hidden-button"
							onclick={() => {
								item.state = 'pending';
							}}
						>
							<Icon icon="material-symbols:next-plan-outline-rounded" font-size={20} />
						</button>
					{:else}
						<button
							class="hidden-button"
							onclick={() => {
								items = items.map((i) => (i.id === item.id ? { ...i, state: 'done' } : i));
							}}
						>
							<Icon icon="material-symbols:check-circle-outline" font-size={20} />
						</button>
					{/if}
				</div>
				{#if item.state === 'done'}
					<hr class="basic-hr absolute-positioning" />
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.section {
		gap: 20px;
		width: 100%;
	}

	.absolute-positioning {
		position: absolute;
		top: -10;
		left: 0;
		width: 90%;
	}
</style>
