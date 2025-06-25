<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import Spinner from './toolkit/svgs/Spinner.svelte';
	import type { ActionedInfoLine, ReceiptLineType } from './api/receipt-service';
	import type { Item } from './api/types';
	import Checkbox from './toolkit/Checkbox.svelte';
	import AutocompleteField from './toolkit/AutocompleteField.svelte';
	import ItemForm from './ItemForm.svelte';

	export interface ScanLineFormProps {
		showForm: boolean;
		line: ReceiptLineType;
		createItem: (data: { title: string; warningAmount: number; quantity: number }) => Promise<Item>;
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
	let lineSaveLoading = $state(false);

	let showItemForm = $state(false);

	let itemTitle = $state('');
	let itemWarningAmount = $state('');
	let itemQuantity = $state('');

	const confirmLineFunc = async () => {
		let stop = false;
		if (!line.actionableInfo.existingItemId && !line.actionableInfo.ignore) {
			generalLineError = 'Please select an Item or choose to ignore this line.';
			stop = true;
		} else {
			generalLineError = '';
		}

		if (stop) {
			return;
		}

		lineSaveLoading = true;
		try {
			//TODO this needs implementation
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
				<label for="item-selection"> Linked Item </label>
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
</div>

{#if showItemForm}
	<div class="cover">
		<div class="popup" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
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
					await createItem(data);
					showItemForm = false;
					line.actionableInfo.existingItemId = undefined;
					line.actionableInfo.existingItemTitle = data.title;
				}}
			/>
		</div>
	</div>
{/if}

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
