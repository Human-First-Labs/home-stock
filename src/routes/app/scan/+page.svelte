<script lang="ts">
	import CameraView from '$lib/toolkit/CameraView.svelte';
	import { fly } from 'svelte/transition';

	let imagesLinks = $state<string[]>([]);
</script>

<!-- <div class="grid">
	{#each imagesLinks as link, index}
		<div
			class="image"
			in:fly={{
				y: Math.random() * 1000,
				x: Math.random() * 1000
			}}
		>
			<img src={link} width="450px" alt={'image-' + index} />
		</div>
	{/each}
</div> -->
<section class="section">
	<CameraView
		addImageLink={(imageLink) => {
			imagesLinks.push(imageLink);
		}}
	/>
</section>

<style>
	/* .grid {
		display: flex;
		flex-wrap: wrap;
	} */
	section {
		display: flex;
		flex: 0.6;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
</style>
