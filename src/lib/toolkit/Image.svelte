<script lang="ts">
	import defaultPlaceholder from './assets/placeholder-image.jpg';

	export interface ImageProps {
		/** This is the string that will serve as a the source for this image*/
		src: string;
		/** This is the placeholder that will take the sources place if the source is an empty string or image fails*/
		placeholderSrc?: string;
		/** This is the string that will serve as alt information*/
		alt: string;
		/** Width and Height*/
		width?: string;
		height?: string;
		borderRadius?: string;
	}
	const { src, placeholderSrc, alt, width, height, borderRadius }: ImageProps = $props();

	// let loading = $state(src ? true : false);
	let error = $state(src ? false : true);

	// let ref: HTMLImageElement | undefined = $state();

	// $effect(() => {
	// 	if (ref?.complete) {
	// 		handleLoad();
	// 	}
	// });

	// const handleLoad = () => {
	// 	loading = false;
	// 	error = false;
	// };

	const handleError = () => {
		// console.log('!error');
		error = true;
		// loading = false;
	};
</script>

<div
	class={[
		'image-container'
		// `${loading}`
	]}
	style={`border-radius: ${borderRadius};`}
>
	<!-- bind:this={ref}
		onload={handleLoad} -->
	<img
		onerror={handleError}
		{src}
		{alt}
		width={width || '100%'}
		height={height || '100%'}
		class={[`${error ? 'actualImageError' : ''}`]}
		style={`border-radius: ${borderRadius};`}
		loading="lazy"
	/>
	<!-- {#if loading}
		<Spinner />
	{:else if error}
		<img
			src={placeholderSrc || defaultPlaceholder}
			{alt}
			class={[error]}
			width={width || '100%'}
			height={height || '100%'}
		/>
	{/if} -->

	{#if error}
		<img
			src={placeholderSrc || defaultPlaceholder}
			{alt}
			class={[error]}
			width={width || '100%'}
			height={height || '100%'}
		/>
	{/if}
</div>

<style>
	.image-container {
		display: flex;
		position: relative; /* For positioning the placeholder and spinner */
		width: 100%;
		height: 100%;
		justify-content: center;
	}

	img {
		object-fit: contain;
		transition: all 0.3s ease;
	}

	.actualImageError {
		display: none;
	}

	.error {
		border: 1px solid var(--error-color);
	}

	/* .loading {
		background-color: var(--background-color);
	} */
</style>
