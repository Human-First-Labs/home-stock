<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import type { ReceiptLineType } from './api/receipt-service';

	export interface ScanLineCardProps {
		scanLine: ReceiptLineType;
		confirmAction?: () => void;
	}

	let { confirmAction, scanLine = $bindable() }: ScanLineCardProps = $props();

	let confirmLoading = $state(false);
	let extraInfo = $state(false);

	const currentAction = $derived.by(() => {
		if (scanLine.actionableInfo.existingItemTitle && scanLine.actionableInfo.existingItemId) {
			return 'add-to-item';
		} else if (scanLine.actionableInfo.ignore) {
			return 'ignore';
		} else {
			return 'none';
		}
	});
</script>

<div class="item-card" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
	<div class="column">
		<div class="row btn-row">
			<h2>{scanLine.title}</h2>
		</div>
		<p>Detected Quantity: {scanLine.quantity}</p>

		{#if scanLine.hsn || scanLine.reference || scanLine.sku || scanLine.upc}
			{#if extraInfo}
				<div class="column" in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
					{#if scanLine.hsn}
						<p>HSN: {scanLine.hsn}</p>
					{/if}
					{#if scanLine.reference}
						<p>Reference: {scanLine.reference}</p>
					{/if}
					{#if scanLine.sku}
						<p>SKU: {scanLine.sku}</p>
					{/if}
					{#if scanLine.sku}
						<p>UPC: {scanLine.upc}</p>
					{/if}
				</div>
			{:else}
				<button
					class="basic-button"
					onclick={() => {
						extraInfo = !extraInfo;
					}}
				>
					{#if extraInfo}
						Hide Extra Info
					{:else}
						Show Extra Info
					{/if}
				</button>
			{/if}
		{/if}
		<hr class="basic-hr" />
		{#if currentAction === 'add-to-item'}
			<p>
				On Confirm, quantiy is added to item "<strong
					>{scanLine.actionableInfo.existingItemTitle}</strong
				>"
			</p>
		{:else if currentAction === 'ignore'}
			<p>On Confirm, line is skipped</p>
		{:else}
			<p>Cannot Confirm, no action detected</p>
		{/if}
	</div>
	{#if scanLine.status === 'PENDING' && confirmAction}
		<button class="basic-button" onclick={confirmAction} disabled={confirmLoading}>
			{#if confirmLoading}
				<span class="loading-spinner"></span>
			{:else if currentAction === 'none'}
				Add Action and Confirm
			{:else}
				Review and Confirm
			{/if}
		</button>
	{/if}
</div>

<style>
	.item-card {
		border: 1px solid var(--primary-color);
		padding: 20px;
		border-radius: 8px;
		width: 200px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		justify-content: space-between;
	}

	.item-card h2 {
		margin: 0;
		font-size: 1.2em;
	}

	.item-card p {
		margin: 5px 0;
	}

	.btn-row {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}
</style>
