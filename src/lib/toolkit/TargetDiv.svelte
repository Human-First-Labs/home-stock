<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import { browser } from '$app/environment';

	interface Position {
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
	}

	type TargetDivPosition =
		| 'top'
		| 'top-end'
		| 'right-start'
		| 'right'
		| 'right-end'
		| 'bottom-end'
		| 'bottom'
		| 'bottom-start'
		| 'left-end'
		| 'left'
		| 'left-start'
		| 'top-start';

	const targetDivPositions: TargetDivPosition[] = [
		'top',
		'top-end',
		'right-start',
		'right',
		'right-end',
		'bottom-end',
		'bottom',
		'bottom-start',
		'left-end',
		'left',
		'left-start',
		'top-start'
	];

	export interface TargetDivProps {
		/** This is just the text */
		children: Snippet;
		/** What the button does*/
		preferredPosition?: TargetDivPosition;
		/** Anchor Element*/
		anchor: HTMLElement;
		/**Match Parent Width */
		matchParentWidth?: 'exact' | 'at-least';
	}

	//------------------------------------------------------------------------------------------------

	const {
		children,
		preferredPosition = 'bottom-start',
		anchor,
		matchParentWidth
	}: TargetDivProps = $props();

	let position = $state<Position | null>(null);
	let ref: HTMLDivElement | null = $state(null);

	const targetSizeInfo = anchor?.getBoundingClientRect();

	const convertPositionToValues = (
		targetSizeInfo: DOMRect,
		mySizeInfo: DOMRect,
		renderPosition: TargetDivPosition
	): Position => {
		const newPosition: Position = {};
		const childWidth = mySizeInfo.width;
		const childHeight = mySizeInfo.height;
		const windowWidth = browser ? window.innerWidth : 0;
		const windowHeight = browser ? window.innerHeight : 0;

		const splitPosition = renderPosition.split('-');

		if (splitPosition.includes('top')) {
			newPosition.top = targetSizeInfo.top - childHeight;

			if (splitPosition.includes('start')) {
				newPosition.left = targetSizeInfo.left;
			} else if (splitPosition.includes('end')) {
				newPosition.right = windowWidth - targetSizeInfo.right;
			} else {
				newPosition.left = targetSizeInfo.left + targetSizeInfo.width / 2 - childWidth / 2;
			}
		}

		if (splitPosition.includes('bottom')) {
			newPosition.top = targetSizeInfo.bottom;

			if (splitPosition.includes('start')) {
				newPosition.left = targetSizeInfo.left;
			} else if (splitPosition.includes('end')) {
				newPosition.right = windowWidth - targetSizeInfo.right;
			} else {
				newPosition.left = targetSizeInfo.left + targetSizeInfo.width / 2 - childWidth / 2;
			}
		}

		if (splitPosition.includes('left')) {
			newPosition.left = targetSizeInfo.left - childWidth;

			if (splitPosition.includes('start')) {
				newPosition.top = targetSizeInfo.top;
			} else if (splitPosition.includes('end')) {
				newPosition.bottom = windowHeight - targetSizeInfo.bottom;
			} else {
				newPosition.top = targetSizeInfo.top + targetSizeInfo.height / 2 - childHeight / 2;
			}
		}

		if (splitPosition.includes('right')) {
			newPosition.left = targetSizeInfo.right;

			if (splitPosition.includes('start')) {
				newPosition.top = targetSizeInfo.top;
			} else if (splitPosition.includes('end')) {
				newPosition.bottom = windowHeight - targetSizeInfo.bottom;
			} else {
				newPosition.top = targetSizeInfo.top + targetSizeInfo.height / 2 - childHeight / 2;
			}
		}
		return {
			top: newPosition.top && newPosition.top <= 0 ? 0 : newPosition.top,
			bottom: newPosition.bottom && newPosition.bottom <= 0 ? 0 : newPosition.bottom,
			left: newPosition.left && newPosition.left <= 0 ? 0 : newPosition.left,
			right: newPosition.right && newPosition.right <= 0 ? 0 : newPosition.right
		};
	};

	const findClosestPosition = (args: {
		usablePositions: TargetDivPosition[];
		preferredPosition: TargetDivPosition;
	}) => {
		const { usablePositions, preferredPosition } = args;

		if (usablePositions.includes(preferredPosition)) {
			return preferredPosition;
		}

		const splitCurrentPosition = preferredPosition.split('-');

		const firstPart = splitCurrentPosition[0];
		const secondPart = splitCurrentPosition[1];

		const closestPosition = usablePositions.find((currPosition) => {
			const splitPosition = currPosition.split('-');

			return splitPosition[0] === firstPart;
		});

		if (closestPosition) {
			return closestPosition;
		} else {
			if (firstPart === 'top') {
				const newPosition = ['right', secondPart]
					.filter((part) => part)
					.join('-') as TargetDivPosition;

				return findClosestPosition({
					usablePositions,
					preferredPosition: newPosition
				});
			} else if (firstPart === 'right') {
				const newPosition = ['bottom', secondPart]
					.filter((part) => part)
					.join('-') as TargetDivPosition;

				return findClosestPosition({
					usablePositions,
					preferredPosition: newPosition
				});
			} else if (firstPart === 'bottom') {
				const newPosition = ['left', secondPart]
					.filter((part) => part)
					.join('-') as TargetDivPosition;

				return findClosestPosition({
					usablePositions,
					preferredPosition: newPosition
				});
			} else if (firstPart === 'left') {
				const newPosition = ['top', secondPart]
					.filter((part) => part)
					.join('-') as TargetDivPosition;

				return findClosestPosition({
					usablePositions,
					preferredPosition: newPosition
				});
			} else {
				throw new Error('Invalid position');
			}
		}
	};

	const generatePosition = () => {
		const mySizeInfo = ref?.getBoundingClientRect();

		const myWidth = mySizeInfo?.width;
		const myHeight = mySizeInfo?.height;
		const windowWidth = browser ? window.innerWidth : 0;
		const windowHeight = browser ? window.innerHeight : 0;

		if (targetSizeInfo && myHeight && myWidth) {
			let forcedPosition: TargetDivPosition = preferredPosition;

			const topSpace = targetSizeInfo.top;
			const bottomSpace = windowHeight - targetSizeInfo.bottom;
			const leftSpace = targetSizeInfo.left;
			const rightSpace = windowWidth - targetSizeInfo.right;

			let unusablePositions: TargetDivPosition[] = [];

			if (topSpace < myHeight) {
				unusablePositions = unusablePositions.concat(['top', 'top-start', 'top-end']);
			}

			if (bottomSpace < myHeight) {
				unusablePositions = unusablePositions.concat(['bottom', 'bottom-start', 'bottom-end']);
			}

			if (leftSpace < myWidth) {
				unusablePositions = unusablePositions.concat(['left', 'left-start', 'left-end']);
			}

			if (rightSpace < myWidth) {
				unusablePositions = unusablePositions.concat(['right', 'right-start', 'right-end']);
			}

			if (topSpace < myHeight - targetSizeInfo.height) {
				unusablePositions = unusablePositions.concat(['left-end', 'right-end']);
			}

			if (bottomSpace < myHeight - targetSizeInfo.height) {
				unusablePositions = unusablePositions.concat(['left-start', 'right-start']);
			}

			if (leftSpace < myWidth - targetSizeInfo.width) {
				unusablePositions = unusablePositions.concat(['top-end', 'bottom-end']);
			}

			if (rightSpace < myWidth - targetSizeInfo.width) {
				unusablePositions = unusablePositions.concat(['top-start', 'bottom-start']);
			}

			const usablePositions = targetDivPositions.filter(
				(currPosition) => !unusablePositions.includes(currPosition)
			);

			try {
				forcedPosition = findClosestPosition({ usablePositions, preferredPosition });
			} catch (e) {
				console.info('Could not find closest Position');
			}

			position = convertPositionToValues(targetSizeInfo, mySizeInfo, forcedPosition);
		}
	};

	onMount(() => {
		generatePosition();
		if (browser) {
			window.addEventListener('resize', generatePosition);
			window.addEventListener('scroll', generatePosition, true);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', generatePosition);
			window.removeEventListener('scroll', generatePosition, true);
		}
	});
</script>

<div
	bind:this={ref}
	class="target-div"
	style={`${position?.top ? `top: ${position.top}px;` : ''} ${position?.bottom ? `bottom: ${position.bottom}px;` : ''} ${position?.left ? `left: ${position.left}px;` : ''} ${position?.right ? `right: ${position.right}px;` : ''} ${matchParentWidth === 'at-least' ? `min-width: ${targetSizeInfo?.width}px;` : matchParentWidth === 'exact' ? `width: ${targetSizeInfo?.width}px;` : ''}`}
>
	{@render children()}
</div>

<style>
	.target-div {
		position: fixed;
		z-index: 10;
		min-height: fit-content;
	}
</style>
