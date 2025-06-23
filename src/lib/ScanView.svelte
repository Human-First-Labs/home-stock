<script lang="ts">
	import type { ReceiptLineType } from './api/receipt-service';
	import ScanLine from './ScanLine.svelte';

	export interface ScanViewProps {
		scan: {
			id: string;
			lines: ReceiptLineType[];
		};
	}

	const { scan }: ScanViewProps = $props();

	const completedLines = $derived(scan.lines.filter((line) => line.status === 'COMPLETED').length);

	const totalLines = $derived(scan.lines.length);

	const pendingLines = $derived(scan.lines.filter((line) => line.status !== 'COMPLETED').length);

	const detectedActionLines = $derived(
		scan.lines.filter(
			(line) =>
				(line.actionableInfo.existingItemId || line.actionableInfo.ignore) &&
				line.status !== 'COMPLETED'
		).length
	);
</script>

<div class="column" style="gap: 20px;">
	<h3>Ongoing Scan</h3>
	<p>
		The following are the items picked up from your last receipt scan. This process can be paused
		and continued whenever you'd like, as every line processed is saved immediately. That said, a
		receipt scan must be fully completed before a new one can be started.
	</p>

	<div class="row" style="justify-content: space-between; align-items: center;">
		<p>
			Progress: {completedLines}/{totalLines}
		</p>
		<button
			class="basic-button"
			onclick={() => {
				//TODO run function here
			}}
			disabled={detectedActionLines === 0 || pendingLines === 0}
		>
			Confirm Detected Actions ({detectedActionLines}/{pendingLines})
		</button>
	</div>
	<small>
		Note: Detected actions are the lines that Home Stock has recognized from previous scans. The
		longer you use Home Stock, the more items it will recognize and have their action detected
		automatically, for quick review.
	</small>
	<hr class="basic-hr" />
	{#each scan.lines as line (line.title)}
		<ScanLine {line} />
	{/each}
</div>
