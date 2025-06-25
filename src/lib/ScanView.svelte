<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ActionedInfoLine, ReceiptLineType } from './api/receipt-service';
	import ScanLineCard from './ScanLineCard.svelte';
	import Spinner from './toolkit/svgs/Spinner.svelte';
	import { fade } from 'svelte/transition';
	import ScanLineForm from './ScanLineForm.svelte';
	import type { Item } from './api/types';
	import { goto } from '$app/navigation';

	export interface ScanViewProps {
		scan: {
			id: string;
			lines: ReceiptLineType[];
		};
		cancelScan: () => Promise<void>;
		bulkConfirmFunc: () => Promise<void>;
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

	const { scan, cancelScan, bulkConfirmFunc, items, createItem, confirmLine }: ScanViewProps =
		$props();

	const completedLines = $derived(scan.lines.filter((line) => line.status === 'COMPLETED'));

	const pendingLines = $derived(scan.lines.filter((line) => line.status !== 'COMPLETED'));

	const detectedActionLines = $derived(
		scan.lines.filter(
			(line) =>
				(line.actionableInfo.existingItemId || line.actionableInfo.ignore) &&
				line.status !== 'COMPLETED'
		).length
	);

	let cancelConfirm = $state(false);
	let cancelLoading = $state(false);
	let cancelError = $state<string | null>(null);

	let bulkConfirm = $state(false);
	let bulkLoading = $state(false);
	let bulkError = $state<string | null>(null);

	let formShow = $state(false);
	let actionLine = $state<ReceiptLineType | null>(null);

	// let generalItemError = $state('');
	// let itemSaveLoading = $state(false);
</script>

<div class="column" style="gap: 20px;">
	<div class="row btn-row">
		<h3>Ongoing Scan</h3>
		<button
			class="basic-button"
			onclick={() => {
				cancelConfirm = true;
			}}
		>
			Cancel Scan
		</button>
	</div>
	<p>
		The following are the items picked up from your last receipt scan. This process can be paused
		and continued whenever you'd like, as every line processed is saved immediately. That said, a
		receipt scan must be fully completed before a new one can be started.
	</p>

	<p id="scan-form">
		Progress: {completedLines.length}/{scan.lines.length}
	</p>
	{#if formShow && actionLine}
		<ScanLineForm
			{confirmLine}
			{createItem}
			bind:showForm={formShow}
			bind:line={actionLine}
			{items}
		/>
	{/if}

	<hr class="basic-hr" />
	{#if pendingLines.length > 0}
		<div class="row btn-row">
			<p style="color: var(--primary-color);">
				Pending Lines: {pendingLines.length} ({detectedActionLines} with actions)
			</p>
			<div class="column">
				<button
					class="basic-button"
					onclick={() => {
						//TODO run function here
					}}
					disabled={detectedActionLines === 0 || pendingLines.length === 0}
				>
					Bulk Confirm ({detectedActionLines}/{pendingLines.length})
				</button>
			</div>
		</div>
		<div class="column item-grid">
			{#each pendingLines as line (line.title)}
				<ScanLineCard
					confirmAction={async () => {
						formShow = true;
						actionLine = line;
						window.location.href = `#scan-form`;
					}}
					scanLine={line}
				/>
			{/each}
		</div>
	{/if}
	{#if completedLines.length > 0}
		<p style="color: var(--secondary-color);">Completed Lines: {completedLines.length}</p>
		<div class="column item-grid">
			{#each completedLines as line (line.title)}
				<ScanLineCard scanLine={line} />
			{/each}
		</div>
	{/if}
</div>
{#if cancelConfirm}
	<div class="cover">
		<div class="popup" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
			<h2>Cancel Scan</h2>
			<p>
				Are you sure you want to cancel this scan? It will still count towards your monthly scan
				limit!
			</p>
			<div class="btn-row">
				<button
					class="basic-button"
					onclick={() => {
						cancelConfirm = false;
					}}
				>
					No
				</button>
				<button
					class="basic-button"
					onclick={async () => {
						cancelLoading = true;
						try {
							await cancelScan();
							cancelConfirm = false;
						} catch (e) {
							cancelError = e instanceof Error ? e.message : 'An unknown error occurred';
						}
						cancelLoading = false;
					}}
				>
					{#if cancelLoading}
						<Spinner />
					{:else}
						Yes
					{/if}
				</button>
			</div>
			{#if cancelError}
				<small class="error-message">{cancelError}</small>
			{/if}
		</div>
	</div>
{/if}
{#if bulkConfirm}
	<div class="cover">
		<div class="popup" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
			<h2>Bulk Confirm</h2>
			<p>
				Are you sure you want to confirm all pending lines? This will mark them as completed, add
				any quantities to existing items and ignore any lines that are set to be ignored.
			</p>
			<div class="btn-row">
				<button
					class="basic-button"
					onclick={() => {
						bulkConfirm = false;
					}}
				>
					No
				</button>
				<button
					class="basic-button"
					onclick={async () => {
						bulkLoading = true;
						try {
							await bulkConfirmFunc();
							bulkConfirm = false;
						} catch (e) {
							bulkError = e instanceof Error ? e.message : 'An unknown error occurred';
						}
						bulkLoading = false;
					}}
				>
					{#if bulkLoading}
						<Spinner />
					{:else}
						Yes
					{/if}
				</button>
			</div>
			{#if bulkError}
				<small class="error-message">{bulkError}</small>
			{/if}
		</div>
	</div>
{/if}

<style>
	.item-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
	}

	.btn-row {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}
</style>
