<script lang="ts">
	import Icon from '@iconify/svelte';

	let dragging = $state(false);

	export interface FileUploaderProps {
		multiple?: boolean;
		maxFiles?: number;
		fileUrls?: string[];
		newFiles: File[];
	}

	let {
		multiple,
		maxFiles,
		fileUrls = $bindable(),
		newFiles = $bindable()
	}: FileUploaderProps = $props();

	const handleDrop = (
		event: DragEvent & {
			currentTarget: EventTarget & HTMLLabelElement;
		}
	) => {
		event.preventDefault();
		dragging = false;
		const droppedFiles = event.dataTransfer?.files;

		if (droppedFiles) {
			if (multiple) {
				newFiles = newFiles.concat(Array.from(droppedFiles));
			} else {
				newFiles = Array.from(droppedFiles);
			}
		}
	};

	const handleDragOver = (
		event: DragEvent & {
			currentTarget: EventTarget & HTMLLabelElement;
		}
	) => {
		event.preventDefault();
		dragging = true;
	};

	const handleDragLeave = () => {
		dragging = false;
	};

	const handleFileChange = (
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		const selected = event.currentTarget?.files;
		if (selected) {
			if (multiple) {
				newFiles = newFiles.concat(Array.from(selected));
			} else {
				newFiles = Array.from(selected);
			}
		}
	};
</script>

<div class="uploader-container">
	<label
		class="dropzone {dragging ? 'dragging' : ''} basic-a"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		aria-label="File uploader dropzone"
		ondragleave={handleDragLeave}
	>
		<input type="file" onchange={handleFileChange} {multiple} max={maxFiles} />
		<div>Drag and drop a file here or click</div>
		<hr />
		<div class="image-grid">
			{#if fileUrls}
				{#each fileUrls as fileUrl, index}
					<div class="column image-container">
						<img
							src={fileUrl}
							alt={`Image ${index + 1}`}
							style="max-width: 100px; max-height: 100px; object-fit: cover; display:flex"
						/>
						<!-- Absolute button to remove this file -->
						<button
							class="delete-button"
							onclick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								fileUrls = fileUrls?.filter((f) => f !== fileUrl);
							}}
						>
							<Icon icon="material-symbols:delete" width="24" height="24" />
						</button>
						<div class="column">
							<small class="file-name">Image {index + 1}</small>
						</div>
					</div>
				{/each}
			{/if}
			{#each newFiles as file}
				<div class="column image-container">
					<img
						src={URL.createObjectURL(file)}
						alt={file.name}
						style="max-width: 100px; max-height: 100px; object-fit: cover; display:flex"
					/>
					<!-- Absolute button to remove this file -->
					<button
						class="delete-button"
						onclick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							newFiles = newFiles.filter((f) => f.name !== file.name);
						}}
					>
						<Icon icon="material-symbols:delete" width="24" height="24" />
					</button>
					<div class="column">
						<small class="file-name">{file.name}</small>
					</div>
				</div>
			{/each}
		</div>
	</label>
</div>

<style>
	.uploader-container {
		width: 100%;
		margin: 40px auto;
		font-family: sans-serif;
	}

	.dropzone {
		display: block;
		border: 2px dashed #ccc;
		border-radius: 6px;
		padding: 40px 20px;
		text-align: center;
		cursor: pointer;
		transition: border-color 0.2s;
		background-color: #fdfdfd;
	}

	.image-container {
		width: 100px;
		min-height: 100px;
		justify-content: space-between;
		position: relative;
	}

	.dropzone.dragging {
		border-color: #999;
		background-color: #f9f9f9;
	}

	.dropzone input {
		display: none;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		width: 100%;
		gap: 20px;
	}

	.file-name {
		margin-top: 12px;
		font-weight: bold;
		color: #333;
	}

	.delete-button {
		position: absolute;
		top: 5px;
		right: 5px;
		background: none;
		border: none;
		cursor: pointer;
	}
	.delete-button:hover {
		color: red;
	}

	small {
		display: block;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
