<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import Spinner from './toolkit/svgs/Spinner.svelte';
	import type { ActionedInfoLine, ReceiptLineType } from './api/receipt-service';
	import type { Item } from './api/types';
	import Checkbox from './toolkit/Checkbox.svelte';
	import AutocompleteField from './toolkit/AutocompleteField.svelte';
	import ItemForm from './ItemForm.svelte';
	import { clickOutside } from './toolkit';

	export interface ScanLineFormProps {
		scanId: string;
		showForm: boolean;
		line: ReceiptLineType;
		createItem: (data: { title: string; warningAmount: number; quantity: number }) => Promise<{
			item: Item;
		}>;
		confirmLine: (
			id: string,
			data: {
				actionedInfo: ActionedInfoLine;
				line: ReceiptLineType;
			}
		) => Promise<void>;
		items: Item[];
	}

	let {
		scanId,
		showForm = $bindable(),
		line = $bindable(),
		createItem,
		items,
		confirmLine
	}: ScanLineFormProps = $props();

	let generalLineError = $state('');
	let autocompleteValue = $derived.by(() => {
		return line.actionableInfo.existingItemId
			? {
					id: line.actionableInfo.existingItemId,
					label: line.actionableInfo.existingItemTitle || ''
				}
			: undefined;
	});
	let lineConnectionError = $state('');
	let lineQuantityError = $state('');
	let lineMultiplierError = $state('');
	let lineSaveLoading = $state(false);

	let showItemForm = $state(false);

	let itemTitle = $state('');
	let itemWarningAmount = $state('');
	let itemQuantity = $state('');

	const confirmLineFunc = async () => {
		let stop = false;
		if (!line.actionableInfo.existingItemId && !line.actionableInfo.ignore) {
			lineConnectionError = 'Please select an Item or choose to ignore this line.';
			stop = true;
		} else {
			lineConnectionError = '';
		}

		if (line.actionableInfo.quantityChange < 0) {
			lineQuantityError = 'Quantity cannot be negative.';
			stop = true;
		} else {
			lineQuantityError = '';
		}

		if (line.actionableInfo.quantityMultiplier < 1) {
			lineMultiplierError = 'Quantity multiplier must be at least 1.';
			stop = true;
		} else {
			lineMultiplierError = '';
		}

		if (stop) {
			return;
		}

		lineSaveLoading = true;
		try {
			await confirmLine(scanId, {
				actionedInfo: {
					itemId: line.actionableInfo.existingItemId,
					ignore: line.actionableInfo.ignore,
					quantityChange: line.actionableInfo.quantityChange,
					quantityMultiplier: line.actionableInfo.quantityMultiplier || 1
				},
				line
			});
			showForm = false;
			generalLineError = '';
		} catch (e) {
			console.error('Error saving item:', e);
			generalLineError = 'An error occurred while saving the item. Please try again.';
		}
		lineSaveLoading = false;
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
		<h2>Scan Line Action Information</h2>
	</div>
	<h5>Handling Scan Line: {line.title}</h5>
	<p>
		Here you will decide what to do with the scan line. This information is kept for when this scan
		line is encountered again in the future, and this action will be detected automatically.
	</p>
	<div class="row form-row">
		<div class="column">
			<Checkbox
				checked={line.actionableInfo.ignore === true ? 'yes' : 'no'}
				label="Ignore this line"
				onClick={(state) => {
					if (state === 'yes') {
						line.actionableInfo.ignore = true;
						line.actionableInfo.existingItemId = undefined;
						line.actionableInfo.existingItemTitle = undefined;
					} else {
						line.actionableInfo.ignore = false;
					}
				}}
			/>
		</div>
		{#if !line.actionableInfo.ignore}
			<div class="column">
				<label for="item-selection">Linked Item</label>
				<AutocompleteField
					id="item-selection"
					name="Item Selection"
					placeholder="Connect to item"
					options={items.map((item) => ({
						id: item.id,
						label: item.title
					}))}
					onselect={(selected) => {
						if (selected) {
							line.actionableInfo.existingItemId = selected.id;
							line.actionableInfo.existingItemTitle = selected.label;
						} else {
							line.actionableInfo.existingItemId = undefined;
							line.actionableInfo.existingItemTitle = undefined;
						}
					}}
					bind:value={autocompleteValue}
					oncreatenew={() => {
						showItemForm = true;
					}}
				/>
			</div>
		{/if}
		{#if lineConnectionError}
			<small class="error-message">{lineConnectionError}</small>
		{/if}
	</div>
	{#if !line.actionableInfo.ignore}
		{#if line.actionableInfo.existingItemId}
			<div class="row form-row">
				<div class="column field-column">
					<div class="column">
						<label for="item-quantity">Quantity</label>
						<small
							>This is the quantity of items you have bought, detected by the scan, but can be
							overwritten.</small
						>
					</div>
					<input
						id="item-quantity"
						type="number"
						class="basic-input"
						min="0"
						bind:value={line.actionableInfo.quantityChange}
						placeholder="Items Bought"
					/>
					{#if lineQuantityError}
						<small class="error-message">{lineQuantityError}</small>
					{/if}
				</div>
				<div class="column field-column">
					<div class="column">
						<label for="item-quantity">Quantity Multiplier</label>
						<small>
							This is the multiplier for the quantity of items you have bought. Examples: Eggs, 6
							per pack, bought 2 packs, set multiplier to 6 to get a total of 12 eggs.
						</small>
					</div>
					<input
						id="item-quantity-multiplier"
						type="number"
						class="basic-input"
						min="1"
						bind:value={line.actionableInfo.quantityMultiplier}
						placeholder="Quantity Multiplier"
					/>
					{#if lineMultiplierError}
						<small class="error-message">{lineMultiplierError}</small>
					{/if}
				</div>
			</div>
		{:else}
			<p>Please select an item or ignore this line from above</p>
		{/if}
	{:else}
		<p>Line will be ignored</p>
	{/if}
</div>
<div class="row btn-row">
	<button
		class="basic-button"
		onclick={() => {
			showForm = false;
			generalLineError = '';
		}}
	>
		Cancel
	</button>
	<button class="basic-button" onclick={confirmLineFunc}>
		{#if lineSaveLoading}
			<Spinner />
		{:else}
			Save
		{/if}
	</button>
</div>
{#if generalLineError}
	<small class="error-message">{generalLineError}</small>
{/if}

{#if showItemForm}
	<div class="cover">
		<div
			class="popup"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
			use:clickOutside={{ callbackFunction: () => (showItemForm = false) }}
		>
			<p>
				Create a new item to connect to this scan line. This item will be saved in your inventory.
				The current quantity here will be <strong>added</strong> to the quantity coming from the scan.
			</p>
			<ItemForm
				bind:itemForm={showItemForm}
				bind:itemTitle
				bind:itemWarningAmount
				bind:itemQuantity
				createItem={async (data) => {
					const result = await createItem(data);
					showItemForm = false;
					line.actionableInfo.existingItemId = result.item.id;
					line.actionableInfo.existingItemTitle = result.item.title;
				}}
				midScan={true}
			/>
		</div>
	</div>
{/if}

<style>
	.form-row {
		display: flex;
		gap: 20px;
		flex: 1;
	}

	.field-column {
		flex: 1;
		min-width: 150px;
		justify-content: space-between;
	}

	.btn-row {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}
</style>
