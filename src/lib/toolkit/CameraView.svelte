<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let canvas: HTMLCanvasElement | null = null;
	let webcamStream: MediaStream | null = null;
	let video: HTMLVideoElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;

	export interface CameraViewProps {
		onImageSave: (newLink: string) => void;
		onImageDiscard?: () => void;
		skipConfirmation?: boolean;
		pauseOnImage?: boolean;
		hideToggle?: boolean;
		imageExtension?: 'png' | 'jpeg';
	}

	const {
		onImageSave,
		onImageDiscard,
		skipConfirmation,
		hideToggle,
		pauseOnImage,
		imageExtension
	}: CameraViewProps = $props();

	let error = $state('');
	let status = $state<'Taking' | 'Confirming' | 'Viewing'>('Taking');
	const loading = $derived(canvas && webcamStream && video && ctx);
	let currentCamera = $state<'environment' | 'user'>('environment');
	let cameraAmount = $state(0);

	const initialize = async () => {
		try {
			if (!video) {
				const devices = await navigator.mediaDevices.enumerateDevices();
				cameraAmount = devices.filter((device) => device.kind === 'videoinput').length;

				video = document.getElementById('camera-view') as HTMLVideoElement;
			}

			await turnOnCamera();
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'error obtaining navigator.mediaDevices.getUserMedia';
			}
		}
	};

	const turnOnCamera = async () => {
		if (!video) {
			error = 'Video element not found';
			return;
		}

		try {
			webcamStream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					facingMode: {
						ideal: currentCamera
					}
				}
			});

			video.srcObject = webcamStream;

			video.play();
			canvas = document.getElementById('camera-canvas') as HTMLCanvasElement;
			ctx = canvas.getContext('2d');
			video.onloadeddata = () => {
				if (video?.videoHeight) {
					canvas!.height = video.videoHeight;
				}

				if (video?.videoWidth) {
					canvas!.width = video.videoWidth;
				}
			};
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'error obtaining navigator.mediaDevices.getUserMedia';
			}
		}
	};

	const takePhoto = () => {
		if (video) {
			if (skipConfirmation) {
				savePhoto();
			} else {
				video.pause();
				status = 'Confirming';
			}
		}
	};

	const toggleCamera = () => {
		if (cameraAmount > 1) {
			currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
			turnOnCamera();
		}
	};

	const discardPhoto = () => {
		if (video) {
			video.play();
			onImageDiscard && onImageDiscard();
			status = 'Taking';
		}
	};

	const savePhoto = () => {
		if (webcamStream && ctx && video && canvas) {
			ctx.drawImage(video, 0, 0);
			const url = canvas.toDataURL('image/' + (imageExtension || 'png'), 1); // 1 is the quality for jpeg, ignored for png
			onImageSave(url);
			video.play();

			if (pauseOnImage) {
				video.pause();
				status = 'Viewing';
			} else {
				status = 'Taking';
			}
		}
	};

	onMount(() => {
		initialize();
	});

	onDestroy(() => {
		if (video && video.srcObject && webcamStream) {
			const videoTracks = webcamStream.getVideoTracks();
			videoTracks.forEach((track) => {
				track.stop();
			});

			video.srcObject = null;
			webcamStream = null;
		}
	});
</script>

{#if loading}
	<p>loading....</p>
{:else if error}
	<div>
		<p class="error">{error}</p>
		<button onclick={initialize}>Retry</button>
	</div>
{/if}
<div class={loading || error ? 'hide' : undefined}>
	<canvas id="camera-canvas" class="hide"></canvas>
	<div class="camera-div">
		<video
			width="100%"
			height="100%"
			id="camera-view"
			onclick={() => {
				if (status === 'Taking') {
					takePhoto();
				}
			}}
		>
			<track kind="captions" />
		</video>
	</div>
	<div class="bottom-drawer">
		{#if status === 'Taking'}
			<div class="taking-instructions">
				<p>Click anywhere on the image to take a photo</p>
				{#if cameraAmount > 1 && !hideToggle}
					<button class="basic-button" onclick={toggleCamera}>
						<p>Toggle Camera ({currentCamera + 1}/{cameraAmount})</p>
					</button>
				{/if}
			</div>
		{:else if status === 'Confirming'}
			<div class="confirm-instruction row">
				<button class="basic-button" onclick={discardPhoto}>
					<p>Discard</p>
				</button>
				<button class="basic-button" onclick={savePhoto}>
					<p>Save</p>
				</button>
			</div>
		{:else if status === 'Viewing'}
			<div class="view-instruction row">
				<button class="basic-button" onclick={discardPhoto}>
					<p>Discard</p>
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.hide {
		display: none;
	}
	.camera-div {
		background-color: black;
	}
	.bottom-drawer {
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: var(--background-color);
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 20px;
	}

	.taking-instructions {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		gap: 10px;
	}

	.confirm-instruction {
		display: flex;
		justify-content: space-between;
		width: 100%;
		gap: 10px;
	}

	.view-instruction {
		display: flex;
		justify-content: center;
		width: 100%;
		gap: 10px;
	}
	.error {
		color: red;
	}
</style>
