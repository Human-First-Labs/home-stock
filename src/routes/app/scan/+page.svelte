<script lang="ts">
	import CameraView from '$lib/toolkit/CameraView.svelte';
	import Icon from '@iconify/svelte';
	import type { PageProps } from './$types';
	import Spinner from '$lib/toolkit/svgs/Spinner.svelte';
	import ScanView from '$lib/ScanView.svelte';

	const { data }: PageProps = $props();

	let imageLink = $state<string>();

	let uploadError = $state<string | null>(null);
	let uploadLoading = $state(false);
</script>

<div class="column section">
	<div class="row" style="width: 100%;">
		<a href="/app">
			<button class="hidden-button" style="color: var(--primary-color);">
				<Icon icon="material-symbols:arrow-back-rounded" font-size={32} />
			</button>
		</a>
		<h1>Receipt Scanning</h1>
	</div>
	{#if data.currentScan}
		<ScanView scan={data.currentScan} />
	{:else if data.scanNumbers?.number && data.scanNumbers?.number >= 10}
		<p>
			You have reached the maximum number of scans for this month. Please wait until next month to
			scan more receipts.
		</p>
	{:else}
		<div class="column" style="gap: 20px; align-items: center;">
			<p>
				Here you can start receipt scan. Receipt scans an easy way to automatically add you latest
				purchases to the current stock you already have at home, without needing to go through all
				the items you've bought one by one.
			</p>
			<CameraView
				onImageSave={(newImageLink) => {
					imageLink = newImageLink;
				}}
				onImageDiscard={() => {
					imageLink = '';
				}}
				skipConfirmation
				pauseOnImage
			/>
		</div>
		{#if imageLink}
			<button
				class="basic-button"
				onclick={async () => {
					if (imageLink) {
						try {
							uploadLoading = true;
							await data.uploadScan(imageLink, 'png');
						} catch (e) {
							console.error('Error uploading scan:', e);
							uploadError = 'An error occurred while uploading the scan. Please try again.';
						}
						uploadLoading = false;
					}
				}}
			>
				{#if uploadLoading}
					<Spinner />
				{:else}
					<p>Save Scanned Receipt</p>
				{/if}
			</button>
			{#if uploadError}
				<p style="color: red;">{uploadError}</p>
			{/if}
		{:else}
			<p>Take a picture of your receipt to start scanning.</p>
		{/if}
	{/if}
</div>

<style>
	.section {
		gap: 20px;
		width: 100%;
		align-items: center;
	}
</style>
