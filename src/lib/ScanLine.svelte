<script lang="ts">
	import type { ReceiptLineType } from './api/receipt-service';

	export interface ScanLineProps {
		line: ReceiptLineType;
	}

	const { line }: ScanLineProps = $props();
</script>

{#snippet renderAction(line: ReceiptLineType)}
	{#if line.actionableInfo.existingItemTitle && line.actionableInfo.existingItemId}
		<span style="color: var(--primary-color);">
			Detected Action: Adds quantity to existing item "{line.actionableInfo.existingItemTitle}"
		</span>
	{:else if line.actionableInfo.ignore}
		<span style="color: var(--primary-color);"> Detected Action: Lines is skipped </span>
	{:else}
		<span style="color: var(--secondary-color);">No action detected, requires review</span>
	{/if}
{/snippet}

<div class="row" style="gap: 10px; align-items: center">
	<span>{line.title}</span>
	<span>Amount: {line.quantity}</span>
	<span>{@render renderAction(line)}</span>
	<span style="color: var(--secondary-color);">{line.status}</span>
</div>
